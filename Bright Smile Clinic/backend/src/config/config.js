import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  geminiApiKey: process.env.GEMINI_API_KEY,

  // Kept centralized here, not scattered across services — if you ever
  // switch embedding models, this is the one place to change it.
  // 768 is one of Gemini's recommended truncation points (others: 1536, 3072)
  // — arbitrary values work but quality is best validated at these sizes.
  embeddingModel: process.env.EMBEDDING_MODEL || "gemini-embedding-001",
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 3072,
  chatModel: process.env.CHAT_MODEL || "gemini-2.5-flash",

  vectorIndexName: process.env.VECTOR_INDEX_NAME || "vector_index",
  retrievalLimit: Number(process.env.RETRIEVAL_LIMIT) || 3,
};

// Fail fast on boot rather than crashing later mid-request
const requiredKeys = ["mongodbUri", "geminiApiKey"];
for (const key of requiredKeys) {
  if (!config[key]) {
    throw new Error(`Missing required environment variable for: ${key}`);
  }
}

export default config;