import OpenAI from "openai";
import config from "../config/config.js";

const openai = new OpenAI({ apiKey: config.openaiApiKey });

// Embeds an array of strings in a single API call. Batching like this
// instead of one-call-per-chunk is the main cost/speed optimization
// for ingestion — fewer round trips, and OpenAI bills the same either way.
export async function generateEmbeddings(texts) {
  const response = await openai.embeddings.create({
    model: config.embeddingModel,
    input: texts,
    dimensions: config.embeddingDimensions,
  });

  // API doesn't guarantee return order matches input order — sort by
  // the index field to be safe before mapping back to your chunk list.
  return response.data
    .sort((a, b) => a.index - b.index)
    .map((item) => item.embedding);
}

export async function generateChatCompletion(context, question) {
  const systemPrompt = `You are a helpful assistant for Bright Smile Dental Clinic. Answer the user's question using ONLY the context below. If the answer isn't in the context, say you don't have that information and suggest calling the clinic directly. Keep answers concise and friendly.

Context:
${context}`;

  const response = await openai.chat.completions.create({
    model: config.chatModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ],
    temperature: 0.3, // low temperature — this is a support bot, not a creative one
    max_tokens: 300,
  });

  return response.choices[0].message.content.trim();
}
