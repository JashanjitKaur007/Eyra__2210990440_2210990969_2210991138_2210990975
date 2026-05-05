// This script lists available models from the Google Generative AI API. It checks both v1 and v1beta endpoints, handles errors gracefully, and provides recommendations for which models to use for content generation based on their supported methods.
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '').trim();

if (!apiKey) {
  console.log('Found no API Key in your .env file');
  process.exit(1);
}


console.log("ENV KEY RAW:", process.env.GEMINI_API_KEY);


// Function to list available models from the Google Generative AI API. It checks both v1 and v1beta endpoints, handles errors gracefully, and provides recommendations for which models to use for content generation based on their supported methods.

async function listModels() {
  try {
    console.log('Finding all available models.....\n');
    

    const endpoints = [
      'https://generativelanguage.googleapis.com/v1/models',
      'https://generativelanguage.googleapis.com/v1beta/models'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Checking ${endpoint.includes('v1beta') ? 'v1beta' : 'v1'} endpoint...`);
        
        const response = await fetch(`${endpoint}?key=${encodeURIComponent(apiKey)}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`YAY! We Found ${data.models?.length || 0} models\n`);
          
          if (data.models && data.models.length > 0) {
            console.log('📋 Available models:');
            data.models.forEach(model => {
              const name = model.name?.replace('models/', '') || 'Unknown';
              const methods = model.supportedGenerationMethods || [];
              const supportsGenerate = methods.includes('generateContent');
              const icon = supportsGenerate ? '✅' : '❌';
              console.log(`${icon} ${name} (methods: ${methods.join(', ')})`);
            });
            
            console.log('\n We Recommended these models to generate content:');
            const recommended = data.models.filter(m => 
              m.supportedGenerationMethods?.includes('generateContent')
            );
            recommended.forEach(model => {
              const name = model.name?.replace('models/', '') || 'Unknown';
              console.log(`   - ${name}`);
            });
            
            if (recommended.length > 0) {
              const bestModel = recommended[0].name?.replace('models/', '');
              console.log(`\n Try setting in .env: GEMINI_MODEL=${bestModel}`);
            }
          }
          break; 
        } else {
          const text = await response.text();
          console.log(`FAIL ${response.status} ${response.statusText}: ${text}\n`);
        }
      } catch (err) {
        console.log(`FAIL. Error: ${err.message}\n`);
      }
    }
    
  } catch (error) {
    console.log('Failing to list models:', error.message);
  }
}


// Run the function to list models when this script is executed
listModels();