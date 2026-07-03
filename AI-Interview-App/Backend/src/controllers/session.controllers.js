import Session from '../models/session.models.js';
import Question from '../models/questions.models.js';
import Answer from '../models/answers.models.js';
import { generateQuestions } from '../services/ai.services.js';

// POST /api/session/start
export const startSession = async (req, res) => {
  try {
    const { domain, difficulty, totalQuestions } = req.body;
    const userId = req.user._id;

    // Check DB for existing questions
    let questions = await Question.find({ domain, difficulty })
      .limit(totalQuestions)
      .select('-__v');

    // Not enough questions → call Gemini
    if (questions.length < totalQuestions) {
      const needed = totalQuestions - questions.length;
      console.log(`🤖 Calling Gemini for ${needed} questions...`);

      const geminiQuestions = await generateQuestions(domain, difficulty, needed);

      const saved = await Question.insertMany(
        geminiQuestions.map(q => ({
          ...q, domain, difficulty, source: 'gemini'
        }))
      );

      questions = [...questions, ...saved];
    }

    // Update timesAsked
    const questionIds = questions.map(q => q._id);
    await Question.updateMany(
      { _id: { $in: questionIds } },
      { $inc: { timesAsked: 1 } }
    );

    // Create session
    const session = await Session.create({
      userId, domain, difficulty, totalQuestions
    });

    res.status(201).json({
      message: '✅ Session started',
      sessionId: session._id,
      questions: questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        tags: q.tags,
        expectedKeywords: q.expectedKeywords
      }))
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/session/complete
export const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Get all answers for this session
    const answers = await Answer.find({ sessionId });
    if (answers.length === 0) {
      return res.status(400).json({ message: 'No answers found for this session' });
    }

    // Calculate final score
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
    const finalScore = (totalScore / (answers.length * 10)) * 100;

    // Update session
    const session = await Session.findByIdAndUpdate(
      sessionId,
      {
        status: 'completed',
        finalScore: Math.round(finalScore),
        completedAt: new Date(),
        answeredCount: answers.length
      },
      { new: true }
    );

    res.json({
      message: '✅ Session completed',
      finalScore: Math.round(finalScore),
      totalAnswered: answers.length,
      session
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/session/report/:sessionId
export const getSessionReport = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const report = await Answer.aggregate([
      { $match: { sessionId: session._id } },
      {
        $lookup: {
          from: 'questions',
          localField: 'questionId',
          foreignField: '_id',
          as: 'question'
        }
      },
      { $unwind: '$question' },
      {
        $group: {
          _id: '$sessionId',
          avgScore: { $avg: '$score' },
          totalAnswers: { $sum: 1 },
          allKeywordsMissed: { $push: '$keywordsMissed' },
          answers: {
            $push: {
              question: '$question.questionText',
              answer: '$answerText',
              score: '$score',
              feedback: '$feedback',
              keywordsCovered: '$keywordsCovered',
              keywordsMissed: '$keywordsMissed',
              confidenceLevel: '$confidenceLevel',
              timeTaken: '$timeTaken'
            }
          }
        }
      }
    ]);

    res.json({
      session,
      report: report[0]
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};