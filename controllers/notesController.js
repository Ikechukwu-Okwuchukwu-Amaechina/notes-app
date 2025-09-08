const { listNotesByUser, createNote, getNote, updateNote, deleteNote } = require('../models/noteModel');

async function list(req, res) {
  const { tag, tags } = req.query || {};
  const tagsArray = typeof tags === 'string' && tags.length ? tags.split(',').map(s => s.trim()).filter(Boolean) : undefined;
  const notes = await listNotesByUser(req.user.id, { tag, tags: tagsArray });
  res.json({ notes });
}

async function create(req, res) {
  const { title, content, tags } = req.body || {};
  if (!title || !content) return res.status(400).json({ message: 'title and content are required' });
  if (tags !== undefined && !Array.isArray(tags)) return res.status(400).json({ message: 'tags must be an array' });
  const note = await createNote(req.user.id, { title, content, tags });
  res.status(201).json({ note });
}

async function getOne(req, res) {
  try {
    const note = await getNote(req.user.id, req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (e) {
    return res.status(404).json({ message: 'Note not found' });
  }
}

async function updateOne(req, res) {
  const { title, content, tags } = req.body || {};
  if (tags !== undefined && !Array.isArray(tags)) return res.status(400).json({ message: 'tags must be an array' });
  try {
    const note = await updateNote(req.user.id, req.params.id, { title, content, tags });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ note });
  } catch (e) {
    return res.status(404).json({ message: 'Note not found' });
  }
}

async function remove(req, res) {
  try {
    const ok = await deleteNote(req.user.id, req.params.id);
    if (!ok) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    return res.status(404).json({ message: 'Note not found' });
  }
}

module.exports = { list, create, getOne, updateOne, remove };
