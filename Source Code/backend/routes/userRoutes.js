// This file defines the routes for user registration and login. It uses the Express router to define the routes and links them to the corresponding controller functions that handle the logic for user registration and authentication.

// Import necessary modules and controller functions
const express = require('express');
const router = express.Router();
const { UserRegistered, UserAuthorized } = require('../controllers/userController');

// Define the routes for user registration and login, linking them to the appropriate controller functions
router.post('/register', UserRegistered);
router.post('/login', UserAuthorized);

// Export the router to be used in the main application
module.exports = router;