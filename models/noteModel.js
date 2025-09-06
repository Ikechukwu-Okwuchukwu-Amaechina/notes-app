const { readDb, writeDb } = require('./db');
const { v4: uuidv4 } = require('uuid');

function listNotesByUser(userId) {
  const db = readDb();
  return db.notes.filter(n => n.userId === userId);
}

function createNote(userId, { title, content }) {
  const db = readDb();
  const note = { id: uuidv4(), userId, title, content, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  db.notes.push(note);
  writeDb(db);
  return note;
}

function getNote(userId, noteId) {
  const db = readDb();
  return db.notes.find(n => n.id === noteId && n.userId === userId);
}

function updateNote(userId, noteId, { title, content }) {
  const db = readDb();
  const idx = db.notes.findIndex(n => n.id === noteId && n.userId === userId);
  if (idx === -1) return null;
  const note = db.notes[idx];
  note.title = title ?? note.title;
  note.content = content ?? note.content;
  note.updatedAt = new Date().toISOString();
  db.notes[idx] = note;
  writeDb(db);
  return note;
}

function deleteNote(userId, noteId) {
  const db = readDb();
  const before = db.notes.length;
  db.notes = db.notes.filter(n => !(n.id === noteId && n.userId === userId));
  const removed = before !== db.notes.length;
  if (removed) writeDb(db);
  return removed;
}

module.exports = { listNotesByUser, createNote, getNote, updateNote, deleteNote };
