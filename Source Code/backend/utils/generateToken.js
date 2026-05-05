// Function to generate JWT tokens for user authentication. This function takes a user ID as input and returns a signed JWT token that can be used for authenticating API requests. The token is signed using a secret key from environment variables and has an expiration time of 50 days.

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '50d', // 30d krdo
  });
};

module.exports = generateToken;