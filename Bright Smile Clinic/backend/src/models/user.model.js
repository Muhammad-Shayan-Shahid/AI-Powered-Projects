const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // never returned by default on queries
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'rejected'],
      default: 'active',
    },
    // Doctor-only fields
    specialization: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    photoUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Hash the password whenever it's set/changed, never store plain text.
// Mongoose 9's async pre-save hooks take no `next` callback — a thrown error
// (or a rejected promise) is what signals failure.
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
