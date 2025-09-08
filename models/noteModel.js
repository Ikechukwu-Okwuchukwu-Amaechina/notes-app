const { mongoose } = require('./db');

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
  },
  { timestamps: true }
);

noteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    ret.userId = ret.userId?.toString();
    delete ret._id;
    return ret;
  },
});

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

async function listNotesByUser(userId) {
  return Note.find({ userId }).sort({ createdAt: -1 }).exec();
}

async function createNote(userId, { title, content }) {
  const note = await Note.create({ userId, title, content });
  return note;
}

async function getNote(userId, noteId) {
  return Note.findOne({ _id: noteId, userId }).exec();
}

async function updateNote(userId, noteId, { title, content }) {
  const update = {};
  if (title !== undefined) update.title = title;
  if (content !== undefined) update.content = content;
  return Note.findOneAndUpdate({ _id: noteId, userId }, update, { new: true }).exec();
}

async function deleteNote(userId, noteId) {
  const res = await Note.deleteOne({ _id: noteId, userId }).exec();
  return res.deletedCount > 0;
}

module.exports = { Note, listNotesByUser, createNote, getNote, updateNote, deleteNote };
