const { mongoose } = require('./db');

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    tags: {
      type: [String],
      default: [],
      index: true,
      validate: {
        validator: (arr) => Array.isArray(arr),
        message: 'tags must be an array of strings',
      },
    },
  },
  { timestamps: true }
);

// Optimize tag queries: single-field index added above, add compound index for user + tag
noteSchema.index({ userId: 1, tags: 1 });

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

async function listNotesByUser(userId, { tag, tags } = {}) {
  const query = { userId };
  if (tag) query.tags = tag; // matches notes where tags array contains tag
  if (tags && Array.isArray(tags) && tags.length) query.tags = { $all: tags };
  return Note.find(query).sort({ createdAt: -1 }).exec();
}

async function createNote(userId, { title, content, tags }) {
  const payload = { userId, title, content };
  if (Array.isArray(tags)) payload.tags = tags;
  const note = await Note.create(payload);
  return note;
}

async function getNote(userId, noteId) {
  return Note.findOne({ _id: noteId, userId }).exec();
}

async function updateNote(userId, noteId, { title, content, tags }) {
  const update = {};
  if (title !== undefined) update.title = title;
  if (content !== undefined) update.content = content;
  if (tags !== undefined) update.tags = Array.isArray(tags) ? tags : [];
  return Note.findOneAndUpdate({ _id: noteId, userId }, update, { new: true }).exec();
}

async function deleteNote(userId, noteId) {
  const res = await Note.deleteOne({ _id: noteId, userId }).exec();
  return res.deletedCount > 0;
}

module.exports = { Note, listNotesByUser, createNote, getNote, updateNote, deleteNote };
