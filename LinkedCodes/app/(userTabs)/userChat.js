import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView, ActivityIndicator } from 'react-native';
import { auth, db } from "../../firebase";
import { addDoc, collection, onSnapshot, query, orderBy, where } from "firebase/firestore";

export default function Chat({ chatUserId }) {  // Using chatUserId to identify the user you're chatting with
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(true);

  const currentUserId = auth.currentUser.uid; // Get the current authenticated user ID
  const chatId = [chatUserId, currentUserId].sort().join('_'); // Generate unique chat ID between two users

  // Fetch messages from Firestore in real-time
  useEffect(() => {
    const collectionRef = collection(db, 'chats');
    const q = query(collectionRef, where('chatId', '==', chatId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        _id: doc.data()._id, // Unique message ID
        text: doc.data().text, // Message content
        createdAt: doc.data().createdAt.toDate(), // Timestamp
        user: {
          _id: doc.data().user._id, // User ID
          avatar: doc.data().user.avatar, // User avatar
        }
      })));
      setLoadingChat(false); // Hide the loading spinner once messages are fetched
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [chatId]);

  // Send message to Firestore
  const onSend = useCallback((messages = []) => {
    const { _id, createdAt, text, user } = messages[0]; // Destructure message properties
    
    // Add the new message to Firestore
    addDoc(collection(db, 'chats'), {
      _id, // Message ID
      createdAt, // Timestamp
      text, // Message text
      user: { // User information
        _id: currentUserId, // Sender's user ID
        avatar: 'https://i.pravatar.cc/300', // Sender's avatar
      },
      chatId, // Chat ID between the two users
    });

    // Update local messages state in GiftedChat
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, [chatId, currentUserId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loadingChat && <ActivityIndicator size="large" color="#202A44" />}
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUserId, // Current user's ID
          avatar: 'https://i.pravatar.cc/300', // Current user's avatar
        }}
        messagesContainerStyle={{ backgroundColor: "#fff" }}
      />
    </SafeAreaView>
  );
}




