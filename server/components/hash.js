import bcrypt from 'bcrypt';
export function hashpass (password, salt) {
    return bcrypt.hash(password, salt);
}