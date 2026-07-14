import mongoose from "mongoose";

// One document per text chunk from the knowledge base.
// This is the collection Atlas Vector Search queries against.
const chunkSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },

    // If you ever switch embedding models, old and new vectors aren't
    // comparable — this lets you find and re-embed stale chunks instead
    // of silently corrupting search quality.
    embeddingModel: {
      type: String,
      required: true,
    },

    dimensions: {
      type: Number,
      required: true,
    },

    sourceDoc: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["services", "doctors", "insurance", "faqs"],
      index: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    // Hash of the raw text. Lets ingestion skip chunks that already
    // exist unchanged, so re-running ingestion doesn't re-embed or
    // re-insert everything every time.
    contentHash: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chunk", chunkSchema);
