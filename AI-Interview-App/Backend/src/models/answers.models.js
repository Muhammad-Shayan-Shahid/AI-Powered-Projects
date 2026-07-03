import mongoose from "mongoose"; 

const answerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  answerText: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  },
  feedback: {
    type: String
  },
  keywordsCovered: [String],
  keywordsMissed: [String],
  confidenceLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High']
  },
  timeTaken: {
    type: Number
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});


answerSchema.index({ userId: 1, submittedAt: -1 });


answerSchema.index({ userId: 1, domain: 1, score: 1 });


answerSchema.index({ sessionId: 1 });

export default mongoose.model('Answer', answerSchema);