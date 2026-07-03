import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  domain: {
    type: String,
    required: true,
    enum: ['JavaScript', 'Python', 'DSA', 'System Design', 'HR', 'DevOps', 'Data Science']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answeredCount: {
    type: Number,
    default: 0
  },
  finalScore: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});


sessionSchema.index({ userId: 1, domain: 1, startedAt: -1 });


sessionSchema.index(
  { startedAt: 1 },
  {
    expireAfterSeconds: 86400,
    partialFilterExpression: { status: 'abandoned' }
  }
);

export default mongoose.model('Session', sessionSchema);