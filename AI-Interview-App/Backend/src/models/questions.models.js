import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
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
  tags: [String],
  expectedKeywords: [String],
  timesAsked: {
    type: Number,
    default: 0
  },
  avgScore: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    enum: ['manual', 'gemini'],
    default: 'gemini'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


questionSchema.index({ domain: 1, difficulty: 1 });


questionSchema.index({ questionText: 'text', tags: 'text' });

export default mongoose.model('Question', questionSchema);