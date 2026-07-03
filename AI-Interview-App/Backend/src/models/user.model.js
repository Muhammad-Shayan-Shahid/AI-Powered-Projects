import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  targetRole: {
    type: String,
    enum: ['Frontend', 'Backend', 'Full Stack', 'Data Science', 'DevOps'],
    default: 'Full Stack'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});


export default mongoose.model('User', userSchema);