import React, { useState, useEffect } from "react";
import { SafeAreaView, FlatList, Text, View, ActivityIndicator, StyleSheet, TouchableOpacity} from 'react-native';
import { auth, db } from "../../../firebase"; // Adjust path as necessary
import { collection, onSnapshot, query, orderBy, getDocs } from "firebase/firestore";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(true);
  const [userCache, setUserCache] = useState({}); // Cache for usernames

  const currentUserId = auth.currentUser?.uid;
  const router = useRouter();
  // Fetch all usernames from the `user` collection and cache them
  useEffect(() => {
    
    const fetchUsernames = async () => {
      try {
        const snapshot = await getDocs(collection(db, "user"));
        const usernames = {};
        snapshot.forEach(doc => {
          usernames[doc.id] = doc.data().username || "Anonymous"; // Default to "Anonymous" if username is missing
        });
        setUserCache(usernames); // Set cache with all usernames
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, []);

  // Fetch all messages from the `chats` collection in real-time
  useEffect(() => {
    if (currentUserId) {
      const collectionRef = collection(db, 'chats');
      const q = query(
        collectionRef,
        orderBy('createdAt', 'desc') // Order messages by creation date
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setLoadingChat(true);

        const fetchedMessages = snapshot.docs.map(doc => ({
          _id: doc.id, 
          text: doc.data().text,
          createdAt: doc.data().createdAt?.toDate(),
          user: {
            _id: doc.data().user._id, // Sender's user ID
          },
        }));

        setMessages(fetchedMessages);
        setLoadingChat(false);
      });

      return () => unsubscribe(); // Cleanup on component unmount
    }
  }, [currentUserId]);

  // Render each message
  const renderMessage = ({ item }) => {
    const username = userCache[item.user._id] || "Anonymous"; // Get username from cache or use "Anonymous" if not found

    return (
      <View style={styles.messageContainer}>
        <Text style={styles.username}>{username}:</Text>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{item.createdAt.toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
         <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Home")}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.headerApp}>ALL CHATS</Text>
      </View>


      {loadingChat ? (
        <ActivityIndicator size="large" color="#202A44" style={{
          flex: 1
        }}/>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          inverted // Display latest message at the bottom
          style={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2f9FB',
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
  list: {
    flex: 1,
    marginTop: 55
  },
  username: {
    fontWeight: 'bold',
    color: '#FFD700',

  },
  messageText: {
    color: '#fff',
    marginVertical: 5
  },
  timestamp: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'right'
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    height: 90,
    marginBottom: 5,
    borderBlockEndColor: "#ccc",
},
backButton: {
    padding: 10,
    marginRight: 10,
    marginTop: 12
},
headerApp: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#202A44",
    marginLeft: 130,
},
});
