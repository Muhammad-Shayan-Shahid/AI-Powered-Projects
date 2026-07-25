const { GoogleGenAI } = require('@google/genai');
const { GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL, GEMINI_EMBEDDING_DIMENSIONS } = require('../config/config');
const DocumentChunk = require('../models/documentChunk.model');

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Small chunks (a few sentences each) keep each vector focused on one idea,
// which gives more precise $vectorSearch hits than embedding a whole document.
const SENTENCES_PER_CHUNK = 4;
const MAX_CHUNK_CHARS = 1200;
const SENTENCE_SPLIT_REGEX = /[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g;

// Splits document content into small overlap-free chunks. Falls back to a
// fixed-length split for content with no sentence punctuation (e.g. a bare list).
function chunkContent(content) {
  const trimmed = content.trim();
  if (!trimmed) return [];

  const sentences = trimmed.match(SENTENCE_SPLIT_REGEX)?.map((s) => s.trim()).filter(Boolean) || [trimmed];

  const chunks = [];
  let current = '';
  let sentenceCount = 0;

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (current && (sentenceCount >= SENTENCES_PER_CHUNK || candidate.length > MAX_CHUNK_CHARS)) {
      chunks.push(current);
      current = sentence;
      sentenceCount = 1;
    } else {
      current = candidate;
      sentenceCount += 1;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

// taskType is Gemini's retrieval-quality hint: chunks stored ahead of time are
// RETRIEVAL_DOCUMENT, a patient's live question is RETRIEVAL_QUERY (chatbot.service.js).
async function embedTexts(texts, taskType) {
  if (texts.length === 0) return [];

  const response = await ai.models.embedContent({
    model: GEMINI_EMBEDDING_MODEL,
    contents: texts,
    config: { outputDimensionality: GEMINI_EMBEDDING_DIMENSIONS, taskType },
  });

  return response.embeddings.map((embedding) => embedding.values);
}

async function deleteChunksForDocument(documentId) {
  await DocumentChunk.deleteMany({ documentId });
}

// Chunks + embeds a Document's current content and stores fresh DocumentChunk
// records. Caller is responsible for deleting any prior chunks first on update
// (see reembedDocument) so stale and fresh chunks never coexist.
async function createChunksForDocument(document) {
  const chunks = chunkContent(document.content);
  if (chunks.length === 0) return;

  const embeddings = await embedTexts(chunks, 'RETRIEVAL_DOCUMENT');

  await DocumentChunk.insertMany(
    chunks.map((chunkText, i) => ({
      documentId: document._id,
      chunkText,
      embedding: embeddings[i],
    }))
  );
}

// Delete-then-recreate: always run for both create and update, so a document
// edited down to shorter content never leaves orphaned chunks behind.
async function reembedDocument(document) {
  await deleteChunksForDocument(document._id);
  await createChunksForDocument(document);
}

module.exports = {
  chunkContent,
  embedTexts,
  createChunksForDocument,
  deleteChunksForDocument,
  reembedDocument,
};
