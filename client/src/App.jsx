import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_USER_KEY = 'todoAppUser'
const STORAGE_TODOS_KEY = 'todoAppTodos'

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setError('')
    onLogin({ username: username.trim() })
  }

  return (
    <div className="login-card">
      <h1>Log in</h1>
      <p>Enter your username and password to access the to-do list.</p>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Your username"
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </label>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="primary-button">Sign in</button>
      </form>
    </div>
  )
}

function TodoApp({ user, todos, setTodos, onLogout }) {
  const [taskText, setTaskText] = useState('')
  const [taskTime, setTaskTime] = useState('')

  const addTask = (event) => {
    event.preventDefault()
    const trimmedText = taskText.trim()
    if (!trimmedText) return

    setTodos([
      ...todos,
      {
        text: trimmedText,
        time: taskTime,
        completed: false,
        id: Date.now(),
      },
    ])
    setTaskText('')
    setTaskTime('')
  }

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const removeTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className="todo-card">
      <h1 className="todo-title">To-Do-List</h1>
      <div className="todo-header">
        <div>
          <h2>Welcome, {user.username}</h2>
          <p>Manage your tasks and stay productive.</p>
        </div>
        <button className="danger-button" onClick={onLogout}>
          Log out
        </button>
      </div>

      <form onSubmit={addTask} className="form-grid">
        <label className="full-width">
          Task description
          <input
            value={taskText}
            onChange={(event) => setTaskText(event.target.value)}
            placeholder="What do you need to do?"
          />
        </label>
        <label>
          Time
          <input
            type="time"
            value={taskTime}
            onChange={(event) => setTaskTime(event.target.value)}
          />
        </label>
        <button type="submit" className="primary-button">Add task</button>
      </form>

      <div className="todo-list">
        {todos.length === 0 ? (
          <p className="empty-state">No tasks yet. Add your first task above.</p>
        ) : (
          <table className="todo-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.id} className={todo.completed ? 'completed' : ''}>
                  <td>{todo.text}</td>
                  <td>{todo.time || 'Not set'}</td>
                  <td>
                    <label className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todo.id)}
                      />
                      {todo.completed ? 'Done' : 'Pending'}
                    </label>
                  </td>
                  <td>
                    <button className="danger-button delete-button" onClick={() => removeTask(todo.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USER_KEY))
    } catch {
      return null
    }
  })
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_TODOS_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem(STORAGE_TODOS_KEY, JSON.stringify(todos))
  }, [todos])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setTodos([])
    localStorage.removeItem(STORAGE_USER_KEY)
    localStorage.removeItem(STORAGE_TODOS_KEY)
  }

  return (
    <main className="app-shell">
      {user ? (
        <TodoApp user={user} todos={todos} setTodos={setTodos} onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </main>
  )
}

export default App

