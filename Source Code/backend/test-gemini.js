// This script tests the connection to the Gemini API using the provided API key. It attempts to generate content using the gemini-2.5-flash model and handles common errors such as missing API key, API not enabled, or model not available. It provides clear instructions for troubleshooting based on the error encountered.

// Import the Google Generative AI client library and load environment variables from the .env file. The API key is retrieved from the environment variables, and if it is not found, an error message is logged and the script exits.
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Retrieve the API key from environment variables, checking both GEMINI_API_KEY and GOOGLE_API_KEY. If no key is found, log an error message and exit the script.
const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

// Check if the API key is available. If not, log an error message and exit the script.
if (!apiKey) {
  console.log('Not Found API key in your .env file');
  process.exit(1);
}

// Log a message indicating that an API key was found and that the Gemini API connection is being tested in test mode. This provides feedback to the user that the script is running and what it is attempting to do.
console.log('Found API key');
console.log('Gemini API connection in Test Mode...\n');

// Log the raw value of the GEMINI_API_KEY environment variable for debugging purposes. This can help identify issues with how the key is being read from the .env file, such as extra whitespace or incorrect variable names.
async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with the correct model for your account
    console.log('Testing with gemini-2.5-flash model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent('Hello, can you respond with "API working"?');
    const response = await result.response;
    const text = response.text();
    
    console.log('yay! Gemini API is working!');
    console.log('Responsing:', text);
    
  } catch (error) {
    console.log('Error:', error.message);
    
    if (error.status === 403) {
      console.log('\n❌ Access Denied (403)');
      console.log('👉 Fix: Enable the Generative Language API');
      console.log('   • Open: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
      console.log('   • Select your project');
      console.log('   • Click "ENABLE"');
      console.log('   • Wait a few minutes, then retry\n');

    } else if (error.status === 400) {
      console.log('\n❌ Bad Request (400)');
      console.log('👉 Fix: Your API key may be invalid');
      console.log('   • Open: https://aistudio.google.com/app/apikey');
      console.log('   • Generate a new API key');
      console.log('   • Update your .env file\n');

    } else if (error.status === 404) {
      console.log('\n❌ Not Found (404)');
      console.log('👉 Fix: Model may be unavailable or API not enabled');
      console.log('   • Ensure the API is enabled in your project\n');
    } 
  }
}


// Call the test function
testGemini();