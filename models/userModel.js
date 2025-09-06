const { readDb, writeDb } = require('./db');
const { v4: uuidv4 } = require('uuid');

function findByEmail(email) {
  const db = readDb();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function createUser({ name, email, phone, passwordHash, otpCode, otpExpiresAt }) {
  const db = readDb();
  const user = {
    id: uuidv4(),
    name,
    email,
    phone,
    passwordHash,
    isVerified: false,
    otpCode: otpCode || null,
    otpExpiresAt: otpExpiresAt || null,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  return user;
}

function updateUser(user) {
  const db = readDb();
  const idx = db.users.findIndex(u => u.id === user.id);
  if (idx !== -1) {
    db.users[idx] = user;
    writeDb(db);
    return user;
  }
  return null;
}

function findById(id) {
  const db = readDb();
  return db.users.find(u => u.id === id);
}

module.exports = { findByEmail, createUser, updateUser, findById };
