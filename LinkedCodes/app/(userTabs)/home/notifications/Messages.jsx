
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getFirestore, collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../src/cxt/theme'; // Import the useTheme hook

const db = getFirestore();

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { theme } = useTheme(); // Access the theme context

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      const notificationsData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          title: doc.data().title || "Notification",
          body: doc.data().message || "Report", // Default to "Report" if body is missing
          timestamp: doc.data().timestamp,
          reportId: doc.data().reportId || null,
          status: doc.data().status || "unknown"
        }))
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp in descending order

      setNotifications(notificationsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNotificationPress = (reportId) => {
    if (reportId) {
      navigation.navigate('reporting', { reportId });
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));

      // Remove the notification from local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== notificationId)
      );

      console.log(`Notification with ID ${notificationId} deleted from database.`);
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.notificationCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity onPress={() => handleNotificationPress(item.reportId)}>
              <Text style={[styles.notificationTitle, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.notificationBody, { color: theme.text }]}>
                {item.body}
              </Text>
              <Text style={[styles.notificationStatus, { color: theme.subText }]}>
                {`Status: ${item.status} (Report ID: ${item.reportId || "N/A"})`}
              </Text>
              <Text style={[styles.notificationTimestamp, { color: theme.subText }]}>
                {new Date(item.timestamp?.toDate()).toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButtonContainer}
              onPress={() => deleteNotification(item.id)}
            >
              <Text style={styles.deleteButton}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  notificationCard: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationStatus: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  notificationTimestamp: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonContainer: {
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default NotificationsScreen;
