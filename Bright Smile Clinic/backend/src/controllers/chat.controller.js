import { generateEmbeddings, generateChatCompletion } from "../services/ai.service.js";
import { searchSimilarChunks } from "../services/vectorSearch.service.js";

export async function handleChat(req, res, next) {
  try {
    const { question } = req.body;
    console.log("Chat request received:", question);

    // Step 1: Generate embeddings for the question
    console.log("Generating embeddings...");
    const [queryEmbedding] = await generateEmbeddings([question]);
    console.log("Embedding length:", queryEmbedding.length);
    console.log("Embedding generated, searching for similar chunks...");

    // Step 2: Search for similar chunks
    const matches = await searchSimilarChunks(queryEmbedding);
    console.log(`Found ${matches.length} matching chunks`);

    if (matches.length === 0) {
      return res.json({
        answer: "I don't have information on that yet — please call the clinic directly.",
        sources: [],
      });
    }

    // Step 3: Generate chat completion with context
    const context = matches.map((m) => m.text).join("\n\n");
    console.log("Generating chat completion...");
    const answer = await generateChatCompletion(context, question);
    console.log("Chat completion successful");

    res.json({
      answer,
      sources: matches.map((m) => ({
        category: m.category,
        sourceDoc: m.sourceDoc,
        score: m.score,
      })),
    });
  } catch (err) {
    console.error("Chat handler error:", err);
    next(err);
  }
}
