// this middleware is used to protect routes

const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

// Middleware to protect routes by verifying JWT tokens and attaching the authenticated user to the request object
const protect = async (req, res, next) => {
  let token;

// Check if the Authorization header is present and starts with 'Bearer' - this is the standard way to send JWT tokens in HTTP requests
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract the token from the Authorization header - the token is expected to be in the format "Bearer <token
    try {
      token = req.headers.authorization.split(' ')[1];
      const UserDecoding = jwt.verify(token, process.env.JWT_SECRET);      
      req.user = await User.findById(UserDecoding.id).select('-password');      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next(); 
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Export the protect middleware
module.exports = { protect };