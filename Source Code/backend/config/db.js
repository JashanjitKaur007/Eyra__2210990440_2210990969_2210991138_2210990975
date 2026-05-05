// Database connection configuration using Mongoose
const mongoose = require('mongoose');

// Function to connect to the MongoDB database
const connectDB = async () => {

  // Attempt to connect to the database using the connection string from environment variables
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Export the connectDB function for use in other parts of the application
module.exports = connectDB;