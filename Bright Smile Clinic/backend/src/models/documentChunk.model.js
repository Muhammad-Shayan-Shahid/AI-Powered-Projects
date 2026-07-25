const mongoose = require('mongoose');

// One record per chunk of a Document's content, each with its own Gemini
// embedding — this is what the chatbot's Atlas $vectorSearch queries against.
// Never written from patient chat (read-only lookups); only regenerated when
// an admin creates/updates/deletes a Document. See embedding.service.js.
const documentChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    chunkText: {
      type: String,
      required: true,
    },
    // Fixed-length float array from gemini-embedding-001 (see
    // GEMINI_EMBEDDING_DIMENSIONS in config.js) — must match the "numDimensions"
    // configured on the Atlas Vector Search index for this field.
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('DocumentChunk', documentChunkSchema);
