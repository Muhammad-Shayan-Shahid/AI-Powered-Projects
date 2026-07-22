const mongoose = require('mongoose');

// Feeds the future RAG chatbot (Phase 9) — raw content only for now, no
// chunking/embedding yet. Admin-managed only; never written from patient chat.
const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['insurance', 'policy', 'procedure_instructions'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
