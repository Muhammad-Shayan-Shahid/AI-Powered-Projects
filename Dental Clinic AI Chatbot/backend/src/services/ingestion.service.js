import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import Chunk from "../models/chunk.model.js";
import { generateEmbeddings } from "./ai.service.js";
import config from "../config/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

// Maps filenames to the `category` enum on the Chunk model
const FILE_CATEGORY_MAP = {
  "services.txt": "services",
  "doctors.txt": "doctors",
  "insurance_and_policies.txt": "insurance",
  "appointment_faqs.txt": "faqs",
};

const EMBEDDING_BATCH_SIZE = 100; // stay well under API batch limits

function hashContent(text) {
  return crypto.createHash("sha256").update(text.trim()).digest("hex");
}

// Splits on blank lines — matches how the source files are already
// paragraph-separated, one paragraph per service/doctor/FAQ item.
function chunkText(rawText) {
  return rawText
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function ingestAll() {
  const summary = { filesProcessed: 0, totalChunks: 0, newlyInserted: 0, skipped: 0 };

  // 1. Read and chunk every file, tag each with category + content hash up front
  const candidates = [];
  for (const [fileName, category] of Object.entries(FILE_CATEGORY_MAP)) {
    const filePath = path.join(DATA_DIR, fileName);
    const raw = await fs.readFile(filePath, "utf-8");
    const paragraphs = chunkText(raw);

    paragraphs.forEach((text, index) => {
      candidates.push({
        text,
        sourceDoc: fileName,
        category,
        chunkIndex: index,
        contentHash: hashContent(text),
      });
    });

    summary.filesProcessed += 1;
  }
  summary.totalChunks = candidates.length;

  // 2. One DB round trip to find which chunks already exist — makes
  // re-running ingestion after editing one file idempotent and cheap.
  const existingDocs = await Chunk.find({
    contentHash: { $in: candidates.map((c) => c.contentHash) },
  })
    .select("contentHash")
    .lean();
  const existingHashes = new Set(existingDocs.map((doc) => doc.contentHash));

  const newCandidates = candidates.filter((c) => !existingHashes.has(c.contentHash));
  summary.skipped = candidates.length - newCandidates.length;

  if (newCandidates.length === 0) {
    return summary; // nothing changed since last run
  }

  // 3. Batch-embed only the new chunks — far fewer API calls than
  // embedding one chunk per request.
  const batches = chunkArray(newCandidates, EMBEDDING_BATCH_SIZE);
  const docsToInsert = [];

  for (const batch of batches) {
    const embeddings = await generateEmbeddings(batch.map((c) => c.text));
    batch.forEach((candidate, i) => {
      docsToInsert.push({
        ...candidate,
        embedding: embeddings[i],
        embeddingModel: config.embeddingModel,
        dimensions: config.embeddingDimensions,
      });
    });
  }

  // 4. One bulk insert instead of N sequential saves
  const inserted = await Chunk.insertMany(docsToInsert, { ordered: false });
  summary.newlyInserted = inserted.length;

  return summary;
}
