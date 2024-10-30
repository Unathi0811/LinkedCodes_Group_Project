import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView, ActivityIndicator, Modal, View, Text, TouchableOpacity } from 'react-native';
import { auth, db, storage} from "../../../firebase"; // Adjust path as necessary
import { addDoc, collection, onSnapshot, query, orderBy, where, getDownloadURL, ref } from "firebase/firestore";


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(true);
  const [chatVisible, setChatVisible] = useState(false); // State to manage modal visibility
  const [userAvatar, setUserAvatar] = useState('https://i.pravatar.cc/300'); // Default avatar

  // Get the authenticated user's ID
  const currentUserId = auth.currentUser.uid;

  // Set the ID of the user you're chatting with
  const chatUserId = "PT6qntSSCJW9Ob1oNXGzjoBv9op1"; // Replace this with the target user's ID
  const chatId = [currentUserId, chatUserId].sort().join('_'); // Generate unique chat ID based on both users

  // Fetch user's avatar from Firebase Storage
  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
     
        const avatarRef = ref(storage, `profiles/${currentUserId}.jpg`); // Adjust path to your storage structure
        const url = await getDownloadURL(avatarRef);
        setUserAvatar(url);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchUserAvatar();
  }, [currentUserId]);

  // Fetch messages from Firestore in real-time
  useEffect(() => {
    const collectionRef = collection(db, 'chats');
    const q = query(
      collectionRef,
      where('chatId', '==', chatId), // Use chatId to filter messages
      orderBy('createdAt', 'desc') // Order messages by creation date
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoadingChat(true);
      setMessages(snapshot.docs.map(doc => ({
        _id: doc.id, // Unique message ID
        text: doc.data().text, // Message content
        createdAt: doc.data().createdAt?.toDate(), // Timestamp
        user: {
          _id: doc.data().user._id, // User ID of the sender
          avatar: doc.data().user.avatar || 'https://i.pravatar.cc/300', // Fallback avatar if not found
        },
      })));
      setLoadingChat(false); // Hide loading spinner once messages are fetched
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [chatId]);

  // Send message to Firestore
  const onSend = useCallback((messages = []) => {
    const { _id, createdAt, text } = messages[0]; // Destructure message properties

    // Add the new message to Firestore
    addDoc(collection(db, 'chats'), {
      _id, // Message ID
      createdAt, // Timestamp
      text, // Message text
      user: { // User information
        _id: currentUserId, // Sender's user ID
        avatar: userAvatar, // Sender's avatar from storage
      },
      chatId, // Chat ID for this conversation
    });

    // Update local messages state in GiftedChat
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, [chatId, currentUserId, userAvatar]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setChatVisible(true)} style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'blue' }}>Open Chat</Text>
      </TouchableOpacity>

      <Modal
        visible={chatVisible}
        onRequestClose={() => setChatVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18 }}>Chat with User</Text>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <Text style={{ color: 'blue' }}>Close</Text>
            </TouchableOpacity>
          </View>
          {loadingChat && <ActivityIndicator size="large" color="#202A44" />}
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: currentUserId, // Current user's ID
              avatar: userAvatar, // Current user's avatar from storage
            }}
            renderLoading={() => (
              <ActivityIndicator size="large" color="#202A44" />
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
