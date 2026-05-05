// backend/controllers/faceAnalysisController.js
// Handles saving and retrieving face expression analysis results

const FaceAnalysis = require('../models/faceAnalysisModel');

// ─────────────────────────────────────────────────────────
// POST /api/face/analyze
// Saves a single expression detection result for the logged-in user
// ─────────────────────────────────────────────────────────
exports.saveAnalysis = async (req, res) => {
  try {
    const { emotion, confidence, allExpressions, timestamp } = req.body;

    // Validate required fields
    if (!emotion || confidence === undefined || confidence === null) {
      return res.status(400).json({
        success: false,
        message: "Fields 'emotion' and 'confidence' are required.",
      });
    }

    if (typeof confidence !== 'number' || confidence < 0 || confidence > 100) {
      return res.status(400).json({
        success: false,
        message: "'confidence' must be a number between 0 and 100.",
      });
    }

    const doc = new FaceAnalysis({
      user: req.user._id,
      emotion: emotion.toLowerCase().trim(),
      confidence: parseFloat(confidence.toFixed(2)),
      allExpressions: allExpressions || {},
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    const saved = await doc.save();

    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    console.error('[saveAnalysis]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/face/history
// Returns recent face analysis records for the logged-in user
// Supports ?limit= query param (default 100, max 500)
// ─────────────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);

    const records = await FaceAnalysis.find({ user: req.user._id })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    // Build summary of emotion distribution
    const emotionCounts = records.reduce((acc, r) => {
      acc[r.emotion] = (acc[r.emotion] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      count: records.length,
      emotionSummary: emotionCounts,
      data: records,
    });
  } catch (err) {
    console.error('[getHistory]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────
// DELETE /api/face/history
// Clears all face analysis records for the logged-in user
// ─────────────────────────────────────────────────────────
exports.clearHistory = async (req, res) => {
  try {
    const result = await FaceAnalysis.deleteMany({ user: req.user._id });
    return res.status(200).json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    console.error('[clearHistory]', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
