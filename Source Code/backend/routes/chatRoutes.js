// This file defines the routes for the chat-related API endpoints, including generating responses, analyzing faces, and managing chat history. It uses the Express router to define the routes and applies authentication middleware to protect the routes that require user authentication.

// Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const { generateResponse, getHistory, deleteHistory, analyzeFace } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Define the routes and link them to controller functions, applying the protect middleware to ensure that only authenticated users can access these endpoints
router.route('/').post(protect, generateResponse);
router.route('/analyze-face').post(protect, analyzeFace);
router.route('/history').get(protect, getHistory);
router.route('/history/:id').delete(protect, deleteHistory);

router.route('/test').get((req, res) => {
  res.json({ message: 'Chat API is working!' });
});


// Export the router to be used in the main application
module.exports = router;