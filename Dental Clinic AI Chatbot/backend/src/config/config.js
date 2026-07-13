import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Kept centralized here, not scattered across services — if you ever
  // switch embedding models, this is the one place to change it.
  embeddingModel: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 512,
  chatModel: process.env.CHAT_MODEL || "gpt-4o-mini",

  vectorIndexName: process.env.VECTOR_INDEX_NAME || "vector_index",
  retrievalLimit: Number(process.env.RETRIEVAL_LIMIT) || 3,
};

// Fail fast on boot rather than crashing later mid-request
const requiredKeys = ["mongodbUri", "openaiApiKey"];
for (const key of requiredKeys) {
  if (!config[key]) {
    throw new Error(`Missing required environment variable for: ${key}`);
  }
}

export default config;
