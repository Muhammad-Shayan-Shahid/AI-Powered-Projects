import Chunk from "../models/chunk.model.js";
import config from "../config/config.js";

// numCandidates should be meaningfully larger than limit — Atlas uses it
// as the pool size for the approximate nearest-neighbor search before
// narrowing to `limit`. Too close to `limit` hurts recall quality.
export async function searchSimilarChunks(queryEmbedding, limit = config.retrievalLimit) {
  const results = await Chunk.aggregate([
    {
      $vectorSearch: {
        index: config.vectorIndexName,
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: Math.max(limit * 20, 50),
        limit,
      },
    },
    {
      $project: {
        _id: 0,
        text: 1,
        category: 1,
        sourceDoc: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
}
