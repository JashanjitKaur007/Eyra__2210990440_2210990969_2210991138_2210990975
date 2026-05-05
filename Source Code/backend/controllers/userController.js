const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const UserRegistered = async (req, res) => {
  try {
// Extract name, email, and password from the request body - these are the required fields for registration
    const { name, email, password } = req.body;

// Validate that all required fields are provided - if any are missing, return a 400 Bad Request with an appropriate message
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields: name, email, password' });
      return;
    }

    // Check if a user with the provided email already exists in the database - this prevents duplicate registrations
    const ExistingUser = await User.findOne({ email });

    if (ExistingUser) {
      res.status(400).json({ message: 'User already exists' });
      return; // Stop execution
    }


    // Create a new user in the database with the provided name, email, and password - the User model will handle password hashing
    const user = await User.create({
      name,
      email,
      password,
    });

// If the user was successfully created, send back a response with the user's data and a generated token for authentication. The token can be used for subsequent requests to protected routes.
    if (user) {
      // Send back the user's data and a token
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const UserAuthorized = async (req, res) => {
  try {
    const { email, password } = req.body;


    // Validate that both email and password are provided - if either is missing, return a 400 Bad Request with an appropriate message
    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

// Find the user in the database by their email - this is necessary to check if the user exists and to verify the password
    const user = await User.findOne({ email });

// If the user exists and the provided password matches the hashed password in the database, send back a response with the user's data and a generated token for authentication. If the credentials are invalid, return a 401 Unauthorized with an appropriate message.
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

// Export the controller functions for use in other parts of the application
module.exports = { UserRegistered, UserAuthorized };