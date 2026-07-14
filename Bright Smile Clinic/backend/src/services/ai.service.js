import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

// Embeds an array of strings in a single API call
export async function generateEmbeddings(texts) {
  try {
    const response = await ai.models.embedContent({
      model: config.embeddingModel,
      contents: texts.map((text) => ({ parts: [{ text }] })),
    });

    return response.embeddings.map((e) => e.values);
  } catch (err) {
    console.error("Embedding error:", err.message);
    throw err;
  }
}

export async function generateChatCompletion(context, question) {
  try {
    const systemInstruction = `You are a helpful assistant for Bright Smile Dental Clinic. Answer the user's question using ONLY the context below. If the answer isn't in the context, say you don't have that information and suggest calling the clinic directly. Keep answers concise and friendly.

Context:
${context}`;

    const response = await ai.models.generateContent({
      model: config.chatModel,
      contents: [{ role: "user", parts: [{ text: question }] }],
      systemInstruction,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 300,
      },
    });

    // Extract text from the response correctly
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("No response text from AI model");
    }
    return text.trim();
  } catch (err) {
    console.error("Chat completion error:", err.message);
    throw err;
  }
}