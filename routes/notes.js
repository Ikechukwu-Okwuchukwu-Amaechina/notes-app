const express = require('express');
const auth = require('../middleware/auth');
const { listNotesByUser, createNote, getNote, updateNote, deleteNote } = require('../models/noteModel');

const router = express.Router();

// protect all routes
router.use(auth);

// list notes
router.get('/', (req, res) => {
  const notes = listNotesByUser(req.user.id);
  res.json({ notes });
});

// create note
router.post('/', (req, res) => {
  const { title, content } = req.body || {};
  if (!title) return res.status(400).json({ message: 'title is required' });
  const note = createNote(req.user.id, { title, content: content || '' });
  res.status(201).json({ note });
});

// get single note
router.get('/:id', (req, res) => {
  const note = getNote(req.user.id, req.params.id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ note });
});

// update note
router.put('/:id', (req, res) => {
  const { title, content } = req.body || {};
  const note = updateNote(req.user.id, req.params.id, { title, content });
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json({ note });
});

// delete note
router.delete('/:id', (req, res) => {
  const ok = deleteNote(req.user.id, req.params.id);
  if (!ok) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
