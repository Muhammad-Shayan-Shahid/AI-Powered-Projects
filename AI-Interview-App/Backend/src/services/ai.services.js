import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const getModel = () => {
  return new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash-lite',
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.7
  });
};

const callGemini = async (prompt) => {
  const model = getModel();
  const response = await model.invoke(prompt);
  return response.content;
};

export const generateQuestions = async (domain, difficulty, count) => {
  const prompt = `
    Generate ${count} interview questions for the following:
    Domain: ${domain}
    Difficulty: ${difficulty}

    Return ONLY a valid JSON array, no explanation, no markdown, just the array like this:
    [
      {
        "questionText": "question here",
        "tags": ["tag1", "tag2"],
        "expectedKeywords": ["keyword1", "keyword2"]
      }
    ]
  `;

  const text = await callGemini(prompt);
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};

export const evaluateAnswerWithGemini = async (questionText, answerText, expectedKeywords) => {
  const prompt = `
    You are an expert technical interviewer. Evaluate this interview answer.

    Question: ${questionText}
    Candidate's Answer: ${answerText}
    Expected Keywords: ${expectedKeywords.join(', ')}

    Return ONLY a valid JSON object like this:
    {
      "score": 7,
      "feedback": "Your feedback here",
      "keywordsCovered": ["keyword1"],
      "keywordsMissed": ["keyword2"],
      "confidenceLevel": "Medium"
    }

    Score must be between 0-10.
    confidenceLevel must be "Low", "Medium", or "High".
    No markdown, no explanation, just the JSON object.
  `;

  const text = await callGemini(prompt);
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
};