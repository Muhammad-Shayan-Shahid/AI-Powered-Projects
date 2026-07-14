// Creates the Atlas Vector Search index programmatically.
// Run once: node scripts/createVectorIndex.js
// If it fails on your cluster tier, create the same index manually in
// the Atlas UI instead (Search > Create Search Index > Vector Search).

import { MongoClient } from "mongodb";
import config from "../src/config/config.js";

async function createVectorIndex() {
  const client = new MongoClient(config.mongodbUri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("chunks");

    await collection.createSearchIndex({
      name: config.vectorIndexName,
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: config.embeddingDimensions,
            similarity: "cosine",
          },
          {
            // lets $vectorSearch filter by category if you add
            // page-aware retrieval later
            type: "filter",
            path: "category",
          },
        ],
      },
    });

    console.log(`Vector index '${config.vectorIndexName}' created successfully.`);
    console.log("Note: indexing can take a minute or two to become queryable.");
  } catch (err) {
    console.error("Failed to create vector index:", err.message);
    console.error("If this errors out, create it manually in the Atlas UI instead.");
  } finally {
    await client.close();
  }
}

createVectorIndex();
