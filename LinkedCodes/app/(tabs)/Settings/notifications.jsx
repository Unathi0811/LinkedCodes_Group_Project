import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';

// Dummy data 
const dummyNotifications = [
  {
    id: '1',
    type: 'message', 
    title: 'New Message from John',
    date: '2024-10-30',
    description: 'You have received a new message from John Doe.',
  },
  {
    id: '2',
    type: 'report', 
    title: 'New Report Submitted',
    date: '2024-10-29',
    description: 'A user has submitted a new report for review.',
  },
  {
    id: '3',
    type: 'report',
    title: 'Report Updated',
    date: '2024-10-28',
    description: 'The report has been updated by the official.',
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message from Sarah',
    date: '2024-10-27',
    description: 'You have received a new message from Sarah Lee.',
  },
];

const Notifications = () => {
  const handleNotificationPress = (item) => {
    // Handle the notification press here
    console.log('Notification pressed:', item);
  };

  const router = useRouter();

  const renderNotification = ({ item }) => (
    <TouchableOpacity 
      style={styles.notificationContainer} 
      onPress={() => handleNotificationPress(item)} // Handle press event
    >
      <Icon
        name={item.type === 'message' ? 'envelope' : 'clipboard-list'} // Icon names
        size={30}
        color="#202A44"
        style={styles.icon}
      />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDate}>{item.date}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
       {/* Back Button */}
       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#202A44" />
      </TouchableOpacity>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={dummyNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2f9FB',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#202A44",
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: 'row', 
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    alignItems: 'center', 
  },
  icon: {
    marginRight: 15, 
  },
  notificationContent: {
    flex: 1, 
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202A44',
  },
  notificationDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    position: 'absolute', 
    top: 36,
    left: 20,
    padding: 10,
    zIndex: 1, 
  },
});

export default Notifications;