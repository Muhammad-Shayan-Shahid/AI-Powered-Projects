import Answer from '../models/answers.models.js';
import Session from '../models/session.models.js';
import Question from '../models/questions.models.js';
import { evaluateAnswerWithGemini } from '../services/ai.services.js';


export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, answerText, timeTaken } = req.body;
    const userId = req.user._id;

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // Call Gemini for evaluation
    console.log('🤖 Calling Gemini for evaluation...');
    const evaluation = await evaluateAnswerWithGemini(
      question.questionText,
      answerText,
      question.expectedKeywords
    );

    const answer = await Answer.create({
      userId, sessionId, questionId,
      domain: question.domain,
      answerText,
      score: evaluation.score,
      feedback: evaluation.feedback,
      keywordsCovered: evaluation.keywordsCovered,
      keywordsMissed: evaluation.keywordsMissed,
      confidenceLevel: evaluation.confidenceLevel,
      timeTaken
    });

    await Session.findByIdAndUpdate(sessionId, { $inc: { answeredCount: 1 } });

    const allAnswers = await Answer.find({ questionId });
    const newAvg = allAnswers.reduce((s, a) => s + a.score, 0) / allAnswers.length;
    await Question.findByIdAndUpdate(questionId, { avgScore: Math.round(newAvg * 10) / 10 });

    res.status(201).json({
      message: '✅ Answer submitted',
      evaluation
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};