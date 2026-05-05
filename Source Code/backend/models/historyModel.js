// This file defines the Mongoose schema and model for storing user interaction history, including chat messages and face analysis results. It includes fields for user reference, session ID, message details, and analysis results. The schema also has a helper method to format messages for report generation.

// models/history.js
const mongoose = require('mongoose');

// Define the History Schema with fields for user reference, session ID, type of interaction, messages, and analysis results
const storeHistory = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    sessionId: { type: String },
    type: { type: String, enum: ['chat', 'face-analysis'], default: 'chat' },
    messages: [
      {
        prompt: { type: String, required: true },
        response: { type: String, required: true },
        analysis: {
          mainConcern: String,
          severity: String,
          relatedSymptoms: [String],
          cleanedResponse: String,
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    analysis: {
      sentiment: String,
      severity: String,
      topics: [String],
      suggestions: [String],
      mainConcern: String,
      relatedSymptoms: [String],
      cleanedResponse: String,
    },
  },
  { timestamps: true }
);


// Method to format messages for report generation - this can be used to extract relevant information from the stored messages and analysis results for creating user-friendly reports

storeHistory.methods.formatMessagesForReport = function () {
  return this.messages.map((msg) => ({
    text: msg.response || msg.prompt,
    prompt: msg.prompt,
    response: msg.response,
    analysis: msg.analysis || {},
    timestamp: msg.timestamp,
  }));
};

// Create the History model from the schema and export it for use in other parts of the application
const History = mongoose.model('History', storeHistory);


// Export the History model for use in other parts of the application
module.exports = History;