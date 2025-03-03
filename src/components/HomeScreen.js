import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

/**
 * HomeScreen component - Main screen of the Omi Mentor app
 * 
 * This component displays the user's profile, recent insights,
 * and notification history from the AI mentor.
 * 
 * @param {Object} props.mentorService - Instance of the MentorService
 */
const HomeScreen = ({ mentorService }) => {
  const [insights, setInsights] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    // Simulate loading data from the mentor service
    const loadData = async () => {
      try {
        // In a real app, these would come from the mentorService
        setUserProfile({
          name: 'Alex',
          activeHours: 14,
          topTopics: ['work', 'fitness', 'productivity'],
          mentorStyle: 'Supportive Coach',
        });

        setInsights([
          {
            id: '1',
            type: 'productivity',
            title: 'Focus Time Analysis',
            description: 'You had 3 hours of deep focus today, 20% more than your average.',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          },
          {
            id: '2',
            type: 'health',
            title: 'Meeting Fatigue',
            description: 'You seemed stressed during your back-to-back meetings this afternoon.',
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          },
          {
            id: '3',
            type: 'social',
            title: 'Conversation Insight',
            description: 'Your call with Sarah was very positive. Key topics: project timeline, resource allocation.',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
          },
        ]);

        setNotifications([
          {
            id: '1',
            title: 'Time for a break',
            message: 'You\'ve been working for 2 hours straight. Consider taking a 5-minute walk.',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            read: true,
          },
          {
            id: '2',
            title: 'Meeting Preparation',
            message: 'You have a meeting with the design team in 15 minutes. Here are the key points from your last discussion.',
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            read: false,
          },
          {
            id: '3',
            title: 'Goal Reminder',
            message: 'You mentioned wanting to finish the project proposal by today. You\'re 70% complete based on your activity.',
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
            read: true,
          },
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Format timestamp to readable format
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    // Less than a day
    if (diff < 86400000) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // More than a day
    return timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading your mentor insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>{userProfile?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Hi, {userProfile?.name || 'User'}</Text>
            <Text style={styles.profileSubtitle}>Your Omi Mentor is listening</Text>
          </View>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userProfile?.activeHours || 0}h</Text>
            <Text style={styles.statLabel}>Active Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Notifications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{insights.length}</Text>
            <Text style={styles.statLabel}>Insights</Text>
          </View>
        </View>
      </View>

      {/* Recent Insights Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Insights</Text>
        {insights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightTime}>{formatTime(insight.timestamp)}</Text>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            <View style={[styles.insightType, { backgroundColor: getTypeColor(insight.type) }]}>
              <Text style={styles.insightTypeText}>{insight.type}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id} 
            style={[
              styles.notificationCard,
              !notification.read && styles.unreadNotification
            ]}
          >
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationTime}>{formatTime(notification.timestamp)}</Text>
            </View>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mentor Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mentor Settings</Text>
        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingTitle}>Notification Preferences</Text>
          <Text style={styles.settingDescription}>Customize when and how your mentor notifies you</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingTitle}>Mentor Style: {userProfile?.mentorStyle}</Text>
          <Text style={styles.settingDescription}>Adjust your mentor's personality and communication style</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingTitle}>Privacy Settings</Text>
          <Text style={styles.settingDescription}>Manage what your mentor listens to and remembers</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Helper function to get color based on insight type
const getTypeColor = (type) => {
  switch (type.toLowerCase()) {
    case 'productivity':
      return '#4A90E2';
    case 'health':
      return '#50E3C2';
    case 'social':
      return '#F5A623';
    default:
      return '#9B9B9B';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A4A4A',
  },
  profileSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  statLabel: {
    fontSize: 12,
    color: '#9B9B9B',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 15,
  },
  insightCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  insightTime: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  insightDescription: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 10,
  },
  insightType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  insightTypeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  notificationCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  unreadNotification: {
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9B9B9B',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  settingCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 14,
    color: '#9B9B9B',
  },
});

export default HomeScreen;
