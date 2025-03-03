# Development Guide for Omi Mentor App

This guide provides detailed instructions for developing your Omi Mentor app for the hackathon.

## Getting Started with Omi Development

### Prerequisites

- **Omi Dev Kit 2**: The physical wearable device ($69.99)
- **Development Environment**:
  - Node.js (v16+)
  - React Native (for mobile app development)
  - Xcode (for iOS) or Android Studio (for Android)
  - Git for version control

### Setting Up Your Development Environment

1. **Install Node.js and npm**:
   ```bash
   # Using homebrew on macOS
   brew install node
   
   # Verify installation
   node --version
   npm --version
   ```

2. **Install React Native CLI**:
   ```bash
   npm install -g react-native-cli
   ```

3. **Initialize Your Project**:
   ```bash
   npx react-native init OmiMentorApp
   cd OmiMentorApp
   ```

## Integrating with the Omi API

### Authentication

1. **Register for an Omi Developer Account**:
   - Visit the Omi Developer Portal
   - Create an account and register your application
   - Obtain your API keys

2. **Set Up Authentication in Your App**:
   ```javascript
   // src/services/omiAuth.js
   export const initializeOmiSDK = () => {
     const apiKey = 'YOUR_API_KEY';
     const apiSecret = 'YOUR_API_SECRET';
     
     // Initialize the Omi SDK with your credentials
     Omi.initialize({
       apiKey,
       apiSecret,
       environment: 'development' // Use 'production' for release
     });
   };
   ```

### Connecting to the Omi Wearable

1. **Pair with the Device**:
   ```javascript
   // src/services/omiDevice.js
   export const pairWithDevice = async () => {
     try {
       // Start scanning for nearby Omi devices
       const devices = await Omi.scanForDevices();
       
       // Connect to the first available device
       if (devices.length > 0) {
         const connectionResult = await Omi.connect(devices[0].id);
         return connectionResult;
       }
       
       return { success: false, message: 'No devices found' };
     } catch (error) {
       console.error('Error pairing with device:', error);
       return { success: false, message: error.message };
     }
   };
   ```

2. **Listen for Data from the Wearable**:
   ```javascript
   // src/services/omiDataListener.js
   export const startListeningToOmiData = (onDataReceived) => {
     // Subscribe to conversation data from the wearable
     const subscription = Omi.subscribeToConversations((conversationData) => {
       // Process the conversation data
       const processedData = processConversationData(conversationData);
       
       // Pass the processed data to the callback
       onDataReceived(processedData);
     });
     
     return subscription;
   };
   
   const processConversationData = (data) => {
     // Extract relevant information from the conversation
     // Analyze context, sentiment, topics, etc.
     return {
       text: data.text,
       timestamp: data.timestamp,
       context: extractContext(data),
       sentiment: analyzeSentiment(data),
       topics: identifyTopics(data)
     };
   };
   ```

## Implementing the AI Mentor

### Core AI Mentor Service

```javascript
// src/services/mentorService.js
export class MentorService {
  constructor() {
    this.userProfile = {};
    this.conversationHistory = [];
    this.notificationQueue = [];
  }
  
  // Update user profile based on new data
  updateUserProfile(conversationData) {
    // Extract insights from conversation data
    const insights = this.extractInsights(conversationData);
    
    // Update the user profile with new insights
    this.userProfile = {
      ...this.userProfile,
      ...insights
    };
    
    // Store conversation in history
    this.conversationHistory.push({
      timestamp: new Date(),
      data: conversationData,
      insights
    });
    
    // Generate potential notifications based on new insights
    this.generateNotifications(insights);
  }
  
  // Extract meaningful insights from conversation data
  extractInsights(conversationData) {
    // Implement your insight extraction logic here
    // This could involve NLP, pattern matching, etc.
    return {
      // Example insights:
      topics: conversationData.topics,
      sentiment: conversationData.sentiment,
      actionItems: extractActionItems(conversationData),
      questions: extractQuestions(conversationData)
    };
  }
  
  // Generate notifications based on user insights
  generateNotifications(insights) {
    // Implement your notification generation logic
    // This is where your AI mentor's personality and value comes in
    
    // Example: Generate a notification for detected action items
    if (insights.actionItems && insights.actionItems.length > 0) {
      insights.actionItems.forEach(item => {
        this.queueNotification({
          type: 'action_reminder',
          title: 'Action Item Reminder',
          message: `Don't forget to: ${item}`,
          priority: calculatePriority(item),
          triggerTime: calculateOptimalTriggerTime(item)
        });
      });
    }
    
    // Example: Provide encouragement based on sentiment
    if (insights.sentiment && insights.sentiment.score < 0.3) {
      this.queueNotification({
        type: 'encouragement',
        title: 'A little encouragement',
        message: generateEncouragementMessage(insights),
        priority: 'medium',
        triggerTime: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
      });
    }
  }
  
  // Add a notification to the queue
  queueNotification(notification) {
    this.notificationQueue.push(notification);
    this.sortNotificationQueue();
  }
  
  // Sort notifications by priority and trigger time
  sortNotificationQueue() {
    this.notificationQueue.sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then sort by trigger time
      return a.triggerTime - b.triggerTime;
    });
  }
  
  // Get pending notifications that should be sent now
  getPendingNotifications() {
    const now = new Date();
    return this.notificationQueue.filter(notification => 
      notification.triggerTime <= now
    );
  }
  
  // Mark notifications as sent and remove from queue
  markNotificationsAsSent(notificationIds) {
    this.notificationQueue = this.notificationQueue.filter(
      notification => !notificationIds.includes(notification.id)
    );
  }
}

// Helper functions
const extractActionItems = (conversationData) => {
  // Implement action item extraction logic
  // This could use NLP to identify tasks, commitments, etc.
  return [];
};

const extractQuestions = (conversationData) => {
  // Implement question extraction logic
  return [];
};

const calculatePriority = (actionItem) => {
  // Implement priority calculation logic
  return 'medium';
};

const calculateOptimalTriggerTime = (actionItem) => {
  // Implement logic to determine when to send the notification
  return new Date(Date.now() + 60 * 60 * 1000); // Default: 1 hour from now
};

const generateEncouragementMessage = (insights) => {
  // Generate a personalized encouragement message
  return "I noticed you might be feeling down. Remember, challenges are opportunities for growth!";
};
```

### Notification System

```javascript
// src/services/notificationService.js
export class NotificationService {
  constructor(mentorService) {
    this.mentorService = mentorService;
    this.notificationInterval = null;
  }
  
  // Start the notification service
  start() {
    // Check for pending notifications every minute
    this.notificationInterval = setInterval(() => {
      this.checkAndSendNotifications();
    }, 60 * 1000);
  }
  
  // Stop the notification service
  stop() {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.notificationInterval = null;
    }
  }
  
  // Check for pending notifications and send them
  async checkAndSendNotifications() {
    const pendingNotifications = this.mentorService.getPendingNotifications();
    
    if (pendingNotifications.length === 0) return;
    
    const sentNotificationIds = [];
    
    for (const notification of pendingNotifications) {
      try {
        await this.sendNotification(notification);
        sentNotificationIds.push(notification.id);
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
    
    // Mark notifications as sent
    this.mentorService.markNotificationsAsSent(sentNotificationIds);
  }
  
  // Send a notification to the user
  async sendNotification(notification) {
    // Implement platform-specific notification logic
    if (Platform.OS === 'ios') {
      return this.sendIOSNotification(notification);
    } else if (Platform.OS === 'android') {
      return this.sendAndroidNotification(notification);
    }
  }
  
  // Send an iOS notification
  async sendIOSNotification(notification) {
    // Implement iOS-specific notification code
    return new Promise((resolve, reject) => {
      PushNotificationIOS.addNotificationRequest({
        id: notification.id,
        title: notification.title,
        body: notification.message,
        userInfo: notification
      });
      resolve();
    });
  }
  
  // Send an Android notification
  async sendAndroidNotification(notification) {
    // Implement Android-specific notification code
    return new Promise((resolve, reject) => {
      PushNotification.localNotification({
        channelId: 'omi-mentor-channel',
        title: notification.title,
        message: notification.message,
        data: notification
      });
      resolve();
    });
  }
}
```

## User Interface Components

### Main App Component

```jsx
// src/App.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text } from 'react-native';
import { initializeOmiSDK } from './services/omiAuth';
import { pairWithDevice } from './services/omiDevice';
import { startListeningToOmiData } from './services/omiDataListener';
import { MentorService } from './services/mentorService';
import { NotificationService } from './services/notificationService';
import HomeScreen from './components/HomeScreen';

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [mentorService] = useState(new MentorService());
  const [notificationService] = useState(new NotificationService(mentorService));
  
  useEffect(() => {
    // Initialize the Omi SDK
    initializeOmiSDK();
    
    // Connect to the Omi device
    const connectToDevice = async () => {
      const result = await pairWithDevice();
      setIsConnected(result.success);
      
      if (result.success) {
        // Start listening to data from the wearable
        const subscription = startListeningToOmiData((data) => {
          // Update the mentor service with new data
          mentorService.updateUserProfile(data);
        });
        
        // Start the notification service
        notificationService.start();
        
        return () => {
          // Clean up on unmount
          subscription.remove();
          notificationService.stop();
        };
      }
    };
    
    connectToDevice();
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Omi Mentor</Text>
        <View style={[
          styles.connectionIndicator, 
          { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }
        ]} />
      </View>
      <HomeScreen mentorService={mentorService} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default App;
```

## Testing Your Application

### Manual Testing

1. **Device Connection Testing**:
   - Ensure your app can discover and connect to the Omi wearable
   - Verify that connection status is correctly displayed
   - Test reconnection after device disconnection

2. **Data Processing Testing**:
   - Verify that conversation data is correctly received from the wearable
   - Check that insights are properly extracted from conversations
   - Ensure user profile is updated with new insights

3. **Notification Testing**:
   - Test that notifications are generated based on user insights
   - Verify that notifications are delivered at the appropriate times
   - Check that notification content is relevant and helpful

### Automated Testing

```javascript
// __tests__/mentorService.test.js
import { MentorService } from '../src/services/mentorService';

describe('MentorService', () => {
  let mentorService;
  
  beforeEach(() => {
    mentorService = new MentorService();
  });
  
  test('should extract insights from conversation data', () => {
    const conversationData = {
      text: 'I need to finish the report by tomorrow',
      sentiment: { score: 0.6 },
      topics: ['work', 'deadline']
    };
    
    const insights = mentorService.extractInsights(conversationData);
    
    expect(insights).toHaveProperty('actionItems');
    expect(insights.actionItems).toContain('finish the report');
  });
  
  test('should generate notifications based on insights', () => {
    const insights = {
      actionItems: ['finish the report'],
      sentiment: { score: 0.6 },
      topics: ['work', 'deadline']
    };
    
    mentorService.generateNotifications(insights);
    
    expect(mentorService.notificationQueue.length).toBeGreaterThan(0);
    expect(mentorService.notificationQueue[0]).toHaveProperty('type', 'action_reminder');
  });
});
```

## Optimizing Your App

### Performance Optimization

1. **Minimize Battery Usage**:
   - Optimize the frequency of data processing
   - Use efficient algorithms for insight extraction
   - Implement batch processing for notifications

2. **Reduce Memory Footprint**:
   - Limit the size of conversation history
   - Implement data pruning for older conversations
   - Use efficient data structures for storing insights

### User Experience Optimization

1. **Notification Timing**:
   - Implement smart timing to avoid notification fatigue
   - Consider user context when sending notifications
   - Allow users to customize notification preferences

2. **Personalization**:
   - Adapt mentor behavior based on user feedback
   - Implement learning algorithms to improve over time
   - Allow users to customize their mentor's personality

## Debugging Tips

1. **Logging**:
   ```javascript
   // Add comprehensive logging
   console.log('Received conversation data:', JSON.stringify(conversationData));
   ```

2. **Error Handling**:
   ```javascript
   try {
     // Risky operation
     const result = await riskyOperation();
     return result;
   } catch (error) {
     console.error('Operation failed:', error);
     // Implement fallback behavior
     return fallbackResult;
   }
   ```

3. **Device Connection Issues**:
   - Check Bluetooth permissions
   - Verify device is powered on and in range
   - Ensure device firmware is up to date

## Next Steps

After implementing the core functionality, consider adding these advanced features:

1. **Machine Learning Integration**:
   - Implement on-device ML for better insight extraction
   - Use ML to predict optimal notification timing
   - Train models to personalize mentor responses

2. **Voice Interaction**:
   - Add voice commands for interacting with the mentor
   - Implement voice responses for a more natural experience
   - Use voice analysis for additional insights

3. **Social Features**:
   - Allow users to share insights with friends or coaches
   - Implement mentor-to-mentor communication
   - Create community challenges and goals

Remember, the key to winning the hackathon is creating a mentor that provides genuinely helpful and timely advice that improves the user's daily life!
