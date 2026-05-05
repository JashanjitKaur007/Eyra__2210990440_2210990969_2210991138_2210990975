// This file contains utility functions for analyzing chat messages, including sentiment analysis, keyword extraction, roadmap generation, and report generation. These functions are used to provide insights into the conversation and help generate summaries and reports based on the chat history.



// Define sentiment analysis function
const analyzeSentiment = (text) => {
  if (!text || typeof text !== 'string') return 'neutral';

  // Basic keyword-based sentiment analysis - this is a simple implementation and can be improved with more sophisticated NLP techniques or libraries for better accuracy.
  const positiveWords = [
    'good', 'great', 'excellent', 'awesome', 'happy', 'love', 'helpful',
    'amazing', 'wonderful', 'fantastic', 'perfect', 'yes', 'agree', 'better',
    'calm', 'peaceful', 'relieved', 'hopeful', 'motivated'
  ];

// List of negative words to identify negative sentiment in the text. This list can be expanded based on common expressions of negative emotions or experiences.
  const negativeWords = [
    'bad', 'sad', 'angry', 'frustrated', 'terrible', 'awful', 'hate',
    'worst', 'stress', 'stressed', 'anxious', 'worried', 'overwhelmed',
    'depressed', 'tired', 'exhausted', 'hopeless', 'no', 'disagree', 'problem'
  ];

  // Normalize the text by converting it to lowercase and removing punctuation, then split it into individual words for analysis.
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  let score = 0;

  words.forEach((word) => {
    if (positiveWords.includes(word)) score += 2;
    if (negativeWords.includes(word)) score -= 2;
  });

  if (score > 3) return 'positive';
  if (score < -3) return 'negative';
  return 'neutral';
};


// Function to extract keywords from the messages, filtering out common words and focusing on more meaningful terms. This can help identify key topics or concerns in the conversation.
const extractKeywords = (messages) => {
  if (!messages || messages.length === 0) return [];

  const commonWords = new Set([
    'i', 'you', 'the', 'and', 'is', 'are', 'was', 'were', 'a', 'an',
    'to', 'of', 'in', 'on', 'for', 'with', 'it', 'this', 'that', 'they',
    'me', 'my', 'your', 'we', 'our', 'have', 'has', 'had', 'but', 'not'
  ]);

  const freq = {};

  messages.forEach((msg) => {
    if (!msg?.text) return;

    const words = msg.text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')          
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));

    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
};

// Function to generate a roadmap based on the messages, which can be used to create a step-by-step plan or summary of the conversation. This is a simple implementation that can be enhanced with more complex logic to identify key actions or recommendations based on the content of the messages.

const generateRoadmap = (messages) => {
  if (!messages || messages.length === 0) return [];

  return messages.map((msg, idx) => ({
    step: idx + 1,
    text: msg.text?.trim() || '',
    sentiment: analyzeSentiment(msg.text),
    timestamp: msg.timestamp || null,
    sender: msg.sender || (msg.isUser ? 'user' : 'ai') || 'unknown'
  }));
};


// Function to generate a comprehensive report based on the messages, including sentiment summary, keyword extraction, roadmap generation, and overall summary. This function combines the results of the other utility functions to provide a detailed analysis of the conversation.

const generateReport = (messages) => {
  if (!messages || messages.length === 0) {
    return {
      sentimentSummary: { positive: 0, neutral: 0, negative: 0 },
      keywords: [],
      roadmap: [],
      totalMessages: 0,
      summary: "No messages to analyze yet."
    };
  }

  const sentimentSummary = { positive: 0, neutral: 0, negative: 0 };

  messages.forEach((msg) => {
    const sentiment = analyzeSentiment(msg.text);
    if (sentiment === 'positive') sentimentSummary.positive++;
    else if (sentiment === 'negative') sentimentSummary.negative++;
    else sentimentSummary.neutral++;
  });

  const keywords = extractKeywords(messages);
  const roadmap = generateRoadmap(messages);

  const total = messages.length;
  const percentages = {
    positive: Math.round((sentimentSummary.positive / total) * 100) || 0,
    neutral: Math.round((sentimentSummary.neutral / total) * 100) || 0,
    negative: Math.round((sentimentSummary.negative / total) * 100) || 0,
  };


  //  Return a comprehensive report object that includes the sentiment summary, keyword extraction, roadmap, total messages analyzed, and a summary statement. This can be used to provide insights into the conversation and help users understand the overall mood and key topics discussed.
  return {
    sentimentSummary,
    sentimentPercentages: percentages,
    keywords,
    roadmap,
    totalMessages: total,
    summary: `Analyzed ${total} messages in this conversation.`,
    generatedAt: new Date().toISOString()
  };
};


// Function to determine the overall mood of the conversation based on the sentiment summary. This can be used to provide a quick overview of the general tone of the conversation, which can be helpful for users to understand how they are feeling or how the conversation is progressing.
const getOverallMood = (messages) => {
  const report = generateReport(messages);
  const { positive, negative, neutral } = report.sentimentSummary;

  if (positive > negative + neutral) return 'positive';
  if (negative > positive + neutral) return 'negative';
  return 'mixed';
};


// Export the utility functions for use in other parts of the application, such as in the chat controller where these functions can be called to analyze the chat messages and generate reports based on user interactions.
module.exports = {
  analyzeSentiment,
  extractKeywords,
  generateRoadmap,
  generateReport,
  getOverallMood,
};