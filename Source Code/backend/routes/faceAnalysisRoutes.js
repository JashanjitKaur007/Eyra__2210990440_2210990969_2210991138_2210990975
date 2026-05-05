// backend/routes/faceAnalysisRoutes.js
// All routes are protected — require valid JWT via 'protect' middleware

const express = require('express');
const router = express.Router();
const { saveAnalysis, getHistory, clearHistory } = require('../controllers/faceAnalysisController');
const { protect } = require('../middleware/authMiddleware');

// POST   /api/face/analyze   — save a detection result
router.post('/analyze', protect, saveAnalysis);

// GET    /api/face/history   — fetch user's stored results
router.get('/history', protect, getHistory);

// DELETE /api/face/history   — clear all user's results
router.delete('/history', protect, clearHistory);

module.exports = router;
