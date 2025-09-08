const { listNotesByUser, createNote, getNote, updateNote, deleteNote } = require('../models/noteModel');

async function list(req, res) {
  const notes = await listNotesByUser(req.user.id);
  res.json({ notes });
}

async function create(req, res) {
  const { title, content } = req.body || {};
  if (!title) return res.status(400).json({ message: 'title is required' });
  const note = await createNote(req.user.id, { title, content: content || '' });
  res.status(201).json({ note });
}

async function getOne(req, res) {
  const note = await getNote(req.user.id, req.params.id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ note });
}

async function updateOne(req, res) {
  const { title, content } = req.body || {};
  const note = await updateNote(req.user.id, req.params.id, { title, content });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ note });
}

async function remove(req, res) {
  const ok = await deleteNote(req.user.id, req.params.id);
  if (!ok) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Deleted' });
}

module.exports = { list, create, getOne, updateOne, remove };
