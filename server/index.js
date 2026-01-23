import express from 'express';
import { pool } from './db.js';
import bcrypt from 'bcrypt';
import { hashpass } from './components/hash.js';
import session from 'express-session';
const app = express();
const PORT = 3000;  

app. use (express.json());

app.use(session({
    secret: 'qwerty'
}));

app.get('/get-session', (req, res) => {
    if  (req.session.user){
        res.status(200).json({ success: true, user: req.session.user });
    }else{
        res.status(401).json({ success: false});
    }
});
    
app.get('/get-lists',async (req, res) => {
    const list = await pool.query ('SELECT * FROM  list')                                                                       
    res.status(200).json({ success: true, lists: list.rows });
});

app.post('/add-list', async (req, res) => {
    const { listtitle } = req.body;

    await pool.query(
        'INSERT INTO list (title, status) VALUES ($1, $2)',
        [listtitle, "pending"]);

    res.status(200).json({ success: true, message: 'List added successfully' }); 
});

app.post('/edit-list', async (req, res) => {
    const { id,listtitle } = req.body;

    await pool.query('UPDATE list SET title = $2 WHERE id= $1', [id, listtitle]);
    res.status(200).json({ success: true, message: 'List updated successfully' }); 
});

app.post('/delete-list', async (req, res) => {
    const { id } = req.body;

    await pool.query('DELETE FROM list WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: 'List deleted successfully' }); 
});

app.get('/get-items', async (req, res) => {
    const listId =  req.params.id;
    const fillteredItems = items.filter(
     item => item.listId == listId);
 
     if(fillteredItems.length === 0) {
         return res.status(404).json({ success: false, message: 'No items found for the given list ID' });
     }
 
     res.status(200).json({ success: true, items: fillteredItems }); 
    
 });

 app.post('/get-items',async (req, res) => {
    const list = await pool.query ('SELECT * FROM  items')
    res.status(200).json({ success: true, lists: list.rows });
});

 app.post('/add-items', async (req, res) => {
    const { listId, desc } = req.body;

    await pool.query('INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3)', [listId, desc, "pending"]);
    res.status(200).json({ success: true, message: 'Items added successfully' }); 
});

app.post('/edit-items', async (req, res) => {
    const { id, desc } = req.body;

    await pool.query('UPDATE items SET description = $2 WHERE id =$1', [id, desc]);
    res.status(200).json({ success: true, message: 'Items updated successfully' }); 
});

app.post('/delete-items', async (req, res) => {
    const { id } = req.body;

    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: 'Items deleted successfully' }); 
});
 
app.post('/register', async(req,res) => {
    const {name, username, password, confirm} = req.body;

    if(password == confirm){
        const salt = 18;
        const hash = await hashpass (password, salt);
    await pool.query('INSERT INTO user_accounts (name, username, password) VALUES ($1, $2, $3)', [name,username, hash]);
        res.status(200).json({success:true, message:"Registered successfully"});
    }else{
        res.status(401).json({success:false, message:"Password does not match"});
    }});

app.post('/login', async(req,res) => {
    const {username, password} = req.body;
     const user = await pool.query('SELECT * FROM user_accounts WHERE username=$1', [username]);
    if(user.rows.length > 0){
        const match = await bcrypt.compare(password, user.rows[0].password);
        if (match){

            req.session.user = {
                id: user.rows[0].id,
                name: user.rows[0].name
            }
             res.status(200).json({success:true, message:"Login successful"});
    }else{
        res.status(401).json({success:false, message:"Invalid Password"});
    }
}else{
     res.status(401).json({success:false, message:"Error"});
}});
app.post('/logout', async(req,res) => {
    req.session.destroy((err)=>{
    res.status(200).json({success:true, message:"Logout successful"});    
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});