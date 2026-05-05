// This file defines the User model using Mongoose, which is used to interact with the users collection in the MongoDB database. It includes fields for name, email, and password, as well as methods for hashing passwords and comparing entered passwords with stored hashed passwords.
// models/userModel.js 


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema with fields for name, email, and password. The email field is unique to prevent duplicate registrations. The schema also includes timestamps to track when each user document is created and updated.
const storeUser = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash the password before saving the user document to the database. This ensures that passwords are stored securely. The middleware checks if the password field has been modified (e.g., during registration or password update) and only hashes it if it has been changed.
storeUser.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the stored hashed password. This is used during login to verify that the provided password matches the one stored in the database.
storeUser.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model from the schema and export it for use in other parts of the application
const User = mongoose.model('User', storeUser);

// Export the User model for use in other parts of the application
module.exports = User;