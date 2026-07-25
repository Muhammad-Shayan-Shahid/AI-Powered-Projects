// One-time script to embed every Document created before the embedding
// pipeline existed (Phase 7 testing data) so nothing is missing vectors.
// Safe to re-run: reembedDocument deletes any existing chunks for a document
// before recreating them, so running this twice never duplicates chunks.
//
// Run from backend/: node src/scripts/backfillEmbeddings.js
require('dotenv').config();
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/config');
const Document = require('../models/document.model');
const { reembedDocument } = require('../services/embedding.service');

async function run() {
  await mongoose.connect(MONGO_URI);

  const documents = await Document.find();
  console.log(`Found ${documents.length} document(s) to embed.`);

  let succeeded = 0;
  let skippedEmpty = 0;
  let failed = 0;

  for (const document of documents) {
    if (!document.content.trim()) {
      console.warn(`Skipping "${document.title}" (${document._id}) — empty content.`);
      skippedEmpty += 1;
      continue;
    }

    try {
      await reembedDocument(document);
      console.log(`Embedded "${document.title}" (${document._id}).`);
      succeeded += 1;
    } catch (error) {
      console.error(`Failed to embed "${document.title}" (${document._id}):`, error.message);
      failed += 1;
    }
  }

  console.log(`\nDone. Embedded: ${succeeded}, skipped (empty content): ${skippedEmpty}, failed: ${failed}.`);
  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((error) => {
  console.error('Backfill failed:', error.message);
  process.exit(1);
});
