// backend/models/faceAnalysisModel.js
// Stores face expression analysis results per user session

const mongoose = require('mongoose');

const faceAnalysisSchema = new mongoose.Schema(
  {
    // Link each record to the logged-in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Dominant detected emotion
    emotion: {
      type: String,
      required: true,
      enum: ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral'],
      lowercase: true,
      trim: true,
    },

    // Confidence of dominant emotion (0–100)
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Full breakdown of all emotion probabilities
    allExpressions: {
      happy:     { type: Number, default: 0 },
      sad:       { type: Number, default: 0 },
      angry:     { type: Number, default: 0 },
      fearful:   { type: Number, default: 0 },
      disgusted: { type: Number, default: 0 },
      surprised: { type: Number, default: 0 },
      neutral:   { type: Number, default: 0 },
    },

    // Client-supplied or server-generated timestamp
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for fast per-user time-ordered queries
faceAnalysisSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('FaceAnalysis', faceAnalysisSchema);
