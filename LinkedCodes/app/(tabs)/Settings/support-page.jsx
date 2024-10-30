import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';

// Dummy data 
const messages = [
  { id: '1', sender: 'User 1', content: 'Hi, I need help with my report.', timestamp: '10:30 AM' },
  { id: '2', sender: 'Official', content: 'Sure! What seems to be the problem?', timestamp: '10:31 AM' },
  { id: '3', sender: 'User 1', content: 'I can’t find the report I submitted.', timestamp: '10:32 AM' },
  { id: '4', sender: 'Official', content: 'Let me check that for you.', timestamp: '10:33 AM' },
  { id: '5', sender: 'User 2', content: 'Is there an update on the maintenance request?', timestamp: '10:35 AM' },
  { id: '6', sender: 'Official', content: 'I will look into it and get back to you.', timestamp: '10:36 AM' },
];

const FeedbackAndSupport = () => {
  const router = useRouter(); // Move useRouter here

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback and Support</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.sender}>{item.sender}:</Text>
            <Text style={styles.message}>{item.content}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedbackAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2f9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202A44',
    marginLeft: 20,
  },
  messageList: {
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#202A44',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#D3D3D3', 
  },
  sender: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  message: {
    color: '#fff',
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
    backgroundColor: '#F2f9FB',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#202A44',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
