import { generateEmbeddings, generateChatCompletion } from "../services/ai.service.js";
import { searchSimilarChunks } from "../services/vectorSearch.service.js";

export async function handleChat(req, res, next) {
  try {
    const { question } = req.body;

    const [queryEmbedding] = await generateEmbeddings([question]);
    const matches = await searchSimilarChunks(queryEmbedding);

    if (matches.length === 0) {
      return res.json({
        answer: "I don't have information on that yet — please call the clinic directly.",
        sources: [],
      });
    }

    const context = matches.map((m) => m.text).join("\n\n");
    const answer = await generateChatCompletion(context, question);

    res.json({
      answer,
      sources: matches.map((m) => ({
        category: m.category,
        sourceDoc: m.sourceDoc,
        score: m.score,
      })),
    });
  } catch (err) {
    next(err);
  }
}
