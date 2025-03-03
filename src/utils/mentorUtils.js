/**
 * Mentor Utilities - Helper functions for AI mentor functionality
 * 
 * This module provides utility functions for analyzing conversation data,
 * generating insights, and creating personalized notifications.
 */

/**
 * Extract action items from conversation text
 * @param {string} text - The conversation text to analyze
 * @returns {Array<string>} - Array of identified action items
 */
export const extractActionItems = (text) => {
  if (!text) return [];
  
  // In a real implementation, this would use NLP to identify tasks
  // For this template, we'll use simple pattern matching
  
  const actionPhrases = [
    'need to', 'have to', 'should', 'will', 'going to',
    'must', 'plan to', 'want to', 'intend to'
  ];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const actionItems = [];
  
  for (const sentence of sentences) {
    for (const phrase of actionPhrases) {
      if (sentence.toLowerCase().includes(phrase)) {
        // Clean up the action item
        let actionItem = sentence.trim();
        
        // Remove filler words at the beginning
        actionItem = actionItem.replace(/^(um|uh|so|like|well|i mean|you know|basically)/i, '').trim();
        
        // Add to the list if not already included
        if (actionItem.length > 10 && !actionItems.includes(actionItem)) {
          actionItems.push(actionItem);
        }
        
        break; // Move to next sentence after finding a match
      }
    }
  }
  
  return actionItems;
};

/**
 * Analyze sentiment from conversation text
 * @param {string} text - The conversation text to analyze
 * @returns {Object} - Sentiment analysis result
 */
export const analyzeSentiment = (text) => {
  if (!text) {
    return { score: 0.5, label: 'neutral' };
  }
  
  // In a real implementation, this would use a sentiment analysis model
  // For this template, we'll use a simple keyword-based approach
  
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'happy', 'excited', 'pleased', 'love', 'enjoy', 'positive', 'success',
    'achievement', 'accomplished', 'proud', 'delighted', 'perfect'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'poor', 'disappointing',
    'sad', 'angry', 'upset', 'hate', 'dislike', 'negative', 'failure',
    'problem', 'issue', 'trouble', 'difficult', 'frustrated', 'annoyed'
  ];
  
  const words = text.toLowerCase().split(/\W+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const word of words) {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  }
  
  const totalWords = words.length;
  const positiveScore = totalWords > 0 ? positiveCount / totalWords : 0;
  const negativeScore = totalWords > 0 ? negativeCount / totalWords : 0;
  
  // Calculate sentiment score (0 to 1, where 0 is negative and 1 is positive)
  let score = 0.5; // Neutral by default
  
  if (positiveCount > 0 || negativeCount > 0) {
    score = 0.5 + (positiveScore - negativeScore) * 2.5; // Scale to make differences more pronounced
    score = Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
  }
  
  // Determine sentiment label
  let label;
  if (score >= 0.75) label = 'very positive';
  else if (score >= 0.6) label = 'positive';
  else if (score >= 0.4) label = 'neutral';
  else if (score >= 0.25) label = 'negative';
  else label = 'very negative';
  
  return { score, label };
};

/**
 * Identify main topics from conversation text
 * @param {string} text - The conversation text to analyze
 * @param {number} maxTopics - Maximum number of topics to return
 * @returns {Array<string>} - Array of identified topics
 */
export const identifyTopics = (text, maxTopics = 3) => {
  if (!text) return [];
  
  // In a real implementation, this would use topic modeling or keyword extraction
  // For this template, we'll use a predefined list of topics and check for matches
  
  const topicKeywords = {
    'work': ['job', 'work', 'project', 'task', 'deadline', 'meeting', 'client', 'boss', 'colleague'],
    'health': ['health', 'exercise', 'workout', 'gym', 'run', 'sleep', 'diet', 'food', 'stress', 'tired'],
    'productivity': ['productive', 'efficiency', 'focus', 'distraction', 'procrastination', 'time management', 'priority'],
    'learning': ['learn', 'study', 'course', 'book', 'read', 'knowledge', 'skill', 'training'],
    'social': ['friend', 'family', 'relationship', 'social', 'party', 'meet', 'talk', 'conversation'],
    'finance': ['money', 'finance', 'budget', 'expense', 'cost', 'save', 'invest', 'purchase', 'buy'],
    'technology': ['tech', 'computer', 'software', 'app', 'device', 'phone', 'digital', 'online', 'internet'],
    'travel': ['travel', 'trip', 'vacation', 'visit', 'flight', 'hotel', 'destination', 'journey'],
    'creativity': ['creative', 'design', 'art', 'write', 'create', 'idea', 'inspiration', 'project'],
    'wellbeing': ['wellbeing', 'happiness', 'mood', 'emotion', 'feel', 'mental', 'meditation', 'mindfulness']
  };
  
  const lowerText = text.toLowerCase();
  const topicScores = {};
  
  // Count keyword occurrences for each topic
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    topicScores[topic] = 0;
    
    for (const keyword of keywords) {
      // Count occurrences of the keyword
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      
      if (matches) {
        topicScores[topic] += matches.length;
      }
    }
  }
  
  // Sort topics by score and take the top N
  const sortedTopics = Object.entries(topicScores)
    .filter(([_, score]) => score > 0)
    .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA)
    .map(([topic, _]) => topic)
    .slice(0, maxTopics);
  
  return sortedTopics;
};

/**
 * Generate a personalized notification based on user insights
 * @param {Object} userProfile - User profile data
 * @param {Object} insight - The insight to generate a notification for
 * @returns {Object} - Notification object
 */
export const generateNotification = (userProfile, insight) => {
  if (!insight || !insight.type) {
    return null;
  }
  
  // Base notification structure
  const notification = {
    id: `notif-${Date.now()}`,
    timestamp: new Date(),
    read: false,
    priority: 'medium',
  };
  
  // Generate notification content based on insight type
  switch (insight.type.toLowerCase()) {
    case 'action_item':
      notification.title = 'Action Item Reminder';
      notification.message = `Don't forget: ${insight.content}`;
      notification.priority = insight.urgency || 'medium';
      break;
      
    case 'meeting_prep':
      notification.title = 'Meeting Preparation';
      notification.message = `You have a meeting with ${insight.participants.join(', ')} in ${insight.timeUntil} minutes. ${insight.context || ''}`;
      notification.priority = 'high';
      break;
      
    case 'focus_time':
      notification.title = 'Focus Time Analysis';
      notification.message = `You've been ${insight.focusState} for ${insight.duration} minutes. ${insight.suggestion}`;
      notification.priority = 'medium';
      break;
      
    case 'wellbeing':
      notification.title = 'Wellbeing Check';
      notification.message = insight.content;
      notification.priority = 'medium';
      break;
      
    case 'learning':
      notification.title = 'Learning Opportunity';
      notification.message = `Based on your conversations about ${insight.topic}, you might be interested in ${insight.suggestion}.`;
      notification.priority = 'low';
      break;
      
    case 'social':
      notification.title = 'Social Insight';
      notification.message = insight.content;
      notification.priority = 'low';
      break;
      
    default:
      notification.title = 'Mentor Insight';
      notification.message = insight.content;
      notification.priority = 'medium';
  }
  
  // Personalize based on user profile if available
  if (userProfile && userProfile.mentorStyle) {
    personalizeNotification(notification, userProfile.mentorStyle);
  }
  
  return notification;
};

/**
 * Personalize notification based on mentor style
 * @param {Object} notification - The notification to personalize
 * @param {string} mentorStyle - The user's preferred mentor style
 */
const personalizeNotification = (notification, mentorStyle) => {
  switch (mentorStyle.toLowerCase()) {
    case 'supportive coach':
      notification.message = `${notification.message} You're doing great!`;
      break;
      
    case 'direct advisor':
      // More straightforward, already direct
      break;
      
    case 'analytical guide':
      notification.message = `Analysis: ${notification.message}`;
      break;
      
    case 'friendly companion':
      notification.message = `Hey there! ${notification.message}`;
      break;
      
    case 'productivity expert':
      notification.message = `For optimal productivity: ${notification.message}`;
      break;
      
    default:
      // No personalization needed
  }
};

/**
 * Determine the optimal time to deliver a notification
 * @param {Object} userProfile - User profile with activity patterns
 * @param {Object} notification - The notification to schedule
 * @returns {Date} - The optimal delivery time
 */
export const calculateOptimalDeliveryTime = (userProfile, notification) => {
  // Default to immediate delivery
  const now = new Date();
  
  // In a real implementation, this would:
  // 1. Analyze user's activity patterns
  // 2. Consider notification priority
  // 3. Avoid interrupting focused work or meetings
  // 4. Consider time of day and user preferences
  
  // For this template, we'll use a simple approach
  if (!userProfile || !notification) {
    return now;
  }
  
  // High priority notifications are delivered immediately
  if (notification.priority === 'high') {
    return now;
  }
  
  // Medium priority notifications wait a short time
  if (notification.priority === 'medium') {
    const deliveryTime = new Date(now);
    deliveryTime.setMinutes(deliveryTime.getMinutes() + 5);
    return deliveryTime;
  }
  
  // Low priority notifications wait longer
  const deliveryTime = new Date(now);
  deliveryTime.setMinutes(deliveryTime.getMinutes() + 30);
  return deliveryTime;
};

/**
 * Extract context from conversation data
 * @param {Object} conversationData - The conversation data to analyze
 * @returns {Object} - Extracted context information
 */
export const extractContext = (conversationData) => {
  if (!conversationData) {
    return {};
  }
  
  // In a real implementation, this would use more sophisticated NLP
  // For this template, we'll extract basic context
  
  return {
    location: extractLocation(conversationData),
    timeReferences: extractTimeReferences(conversationData),
    people: extractPeople(conversationData),
    emotions: extractEmotions(conversationData)
  };
};

/**
 * Extract location mentions from conversation
 * @param {Object} conversationData - Conversation data
 * @returns {Array<string>} - Extracted locations
 */
const extractLocation = (conversationData) => {
  // Simplified implementation
  return [];
};

/**
 * Extract time references from conversation
 * @param {Object} conversationData - Conversation data
 * @returns {Array<Object>} - Extracted time references
 */
const extractTimeReferences = (conversationData) => {
  // Simplified implementation
  return [];
};

/**
 * Extract people mentioned in conversation
 * @param {Object} conversationData - Conversation data
 * @returns {Array<string>} - Extracted people
 */
const extractPeople = (conversationData) => {
  if (!conversationData || !conversationData.participants) {
    return [];
  }
  
  return conversationData.participants.filter(p => p !== 'You');
};

/**
 * Extract emotions from conversation
 * @param {Object} conversationData - Conversation data
 * @returns {Array<string>} - Extracted emotions
 */
const extractEmotions = (conversationData) => {
  if (!conversationData || !conversationData.sentiment) {
    return [];
  }
  
  // Map sentiment to emotions
  const sentimentToEmotions = {
    'very positive': ['happy', 'excited', 'enthusiastic'],
    'positive': ['content', 'pleased', 'satisfied'],
    'neutral': ['calm', 'balanced'],
    'negative': ['frustrated', 'disappointed', 'concerned'],
    'very negative': ['angry', 'upset', 'stressed']
  };
  
  const label = conversationData.sentiment.label;
  return sentimentToEmotions[label] || [];
};
