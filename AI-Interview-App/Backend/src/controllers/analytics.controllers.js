import Answer from '../models/answers.models.js';
import Session from '../models/session.models.js';

// GET /api/analytics/dashboard
export const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Answer.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$userId',
          totalAnswers: { $sum: 1 },
          avgScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
          worstScore: { $min: '$score' }
        }
      },
      {
        $project: {
          _id: 0,
          totalAnswers: 1,
          avgScore: { $round: ['$avgScore', 1] },
          bestScore: 1,
          worstScore: 1
        }
      }
    ]);

    const sessionStats = await Session.aggregate([
      { $match: { userId, status: 'completed' } },
      {
        $group: {
          _id: '$userId',
          totalSessions: { $sum: 1 },
          avgFinalScore: { $avg: '$finalScore' },
          bestSession: { $max: '$finalScore' }
        }
      },
      {
        $project: {
          _id: 0,
          totalSessions: 1,
          avgFinalScore: { $round: ['$avgFinalScore', 1] },
          bestSession: 1
        }
      }
    ]);

    // Best performing domain
    const bestDomain = await Answer.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$domain',
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { avgScore: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          domain: '$_id',
          avgScore: { $round: ['$avgScore', 1] }
        }
      }
    ]);

    res.json({
      answers: stats[0] || {},
      sessions: sessionStats[0] || {},
      bestDomain: bestDomain[0] || {}
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/analytics/weak-topics
export const getWeakTopics = async (req, res) => {
  try {
    const userId = req.user._id;

    const weakTopics = await Answer.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$domain',
          avgScore: { $avg: '$score' },
          totalAnswers: { $sum: 1 },
          allKeywordsMissed: { $push: '$keywordsMissed' }
        }
      },
      { $sort: { avgScore: 1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          domain: '$_id',
          avgScore: { $round: ['$avgScore', 1] },
          totalAnswers: 1,
          allKeywordsMissed: 1
        }
      }
    ]);

    res.json({ weakTopics });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/analytics/improvement
export const getImprovement = async (req, res) => {
  try {
    const userId = req.user._id;

    const improvement = await Answer.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            year: { $year: '$submittedAt' },
            week: { $week: '$submittedAt' }
          },
          avgScore: { $avg: '$score' },
          totalAnswers: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          week: '$_id.week',
          avgScore: { $round: ['$avgScore', 1] },
          totalAnswers: 1
        }
      }
    ]);

    res.json({ improvement });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/analytics/confidence
export const getConfidence = async (req, res) => {
  try {
    const userId = req.user._id;

    const confidence = await Answer.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            domain: '$domain',
            confidenceLevel: '$confidenceLevel'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.domain',
          confidenceBreakdown: {
            $push: {
              level: '$_id.confidenceLevel',
              count: '$count'
            }
          },
          totalAnswers: { $sum: '$count' }
        }
      },
      {
        $project: {
          _id: 0,
          domain: '$_id',
          confidenceBreakdown: 1,
          totalAnswers: 1
        }
      }
    ]);

    res.json({ confidence });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/analytics/session-history
export const getSessionHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.aggregate([
      { $match: { userId, status: 'completed' } },
      { $sort: { startedAt: -1 } },
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'sessionId',
          as: 'answers'
        }
      },
      {
        $project: {
          domain: 1,
          difficulty: 1,
          totalQuestions: 1,
          answeredCount: 1,
          finalScore: 1,
          startedAt: 1,
          completedAt: 1,
          totalAnswers: { $size: '$answers' },
          avgScore: { $avg: '$answers.score' }
        }
      }
    ]);

    res.json({ sessions });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};