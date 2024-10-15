import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Pressable, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { db, auth } from '../../../firebase'; 
import { collection, getDocs, addDoc, onSnapshot, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/Feather"
import { GiftedChat } from "react-native-gifted-chat";
import { Overlay } from "@rneui/themed";

const Reporting = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false); // For error messages
  const [confirmationVisible, setConfirmationVisible] = useState(false); // For confirmation alerts
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [userNames, setUserNames] = useState({}); // Store user names by userId

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoadingReports(true);
        const reportsCollection = collection(db, 'reports');
        const reportSnapshot = await getDocs(reportsCollection);
        const reportList = reportSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch the names of users who submitted the reports
        const userIds = [...new Set(reportList.map(report => report.userId))]; // Get unique userIds

        const userPromises = userIds.map(async userId => {
          const userDoc = await getDoc(doc(db, 'user', userId)); // Ensure collection name is correct
          if (userDoc.exists()) {
            return { userId, name: userDoc.data().username }; // Fetch the user name
          } else {
            console.log(`User not found for userId: ${userId}`);
            return { userId, name: 'Unknown User' };
          }
        });

        const userData = await Promise.all(userPromises);

        // Create an object that maps userIds to user names
        const userMap = {};
        userData.forEach(user => {
          userMap[user.userId] = user.name;
        });

        setUserNames(userMap); // Store this mapping in state
        setReports(reportList);
      } catch (error) {
        console.error("Error fetching reports: ", error);
        setError("Could not load reports. Please try again later.");
        setOverlayVisible(true); // Show error overlay
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  // Fetch chat messages for the selected report
  const fetchChatMessages = (reportCreatorId) => {
    const currentUserId = auth.currentUser.uid;
    const chatId = [reportCreatorId, currentUserId].sort().join('_'); // Create a unique chat ID between the two users

    const collectionRef = collection(db, 'chats');
    const q = query(collectionRef, where('chatId', '==', chatId), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoadingChat(true);
      setMessages(snapshot.docs.map(doc => ({
        _id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      })));
      setLoadingChat(false);
    });

    return () => unsubscribe();
  };

  const onSend = useCallback((messages = []) => {
    const currentUserId = auth.currentUser.uid;
    const reportCreatorId = selectedReport.userId;
    const chatId = [reportCreatorId, currentUserId].sort().join('_'); // Use the same chat ID

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, 'chats'), {
      _id,
      createdAt,
      text,
      user,
      chatId, // Store the chat ID so we can filter messages for this chat
    });
  }, [selectedReport]);

  const renderItem = ({ item }) => {
    const userName = userNames[item.userId] || 'Unknown User';
    
    return (
        <View key={item.id} style={styles.card}>
            <View style={styles.profileContainer}>
                <Image 
                    source={{ uri: item.userProfilePhoto || 'https://via.placeholder.com/60' }} 
                    style={styles.profileImage} 
                />
                <Text style={styles.initials}>{userName}</Text>
            </View>
            <View style={styles.reportContainer}>
                <Image 
                    source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
                    style={styles.reportImage} 
                    onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
                />
                <Text style={styles.description}>{item.description || 'No description available.'}</Text>
                <View style={styles.iconContainer}>
                    <Icon name="map-marker" size={24} color="#202A44" />
                    <Icon name="eye" size={24} color="#202A44" />
                    <TouchableOpacity 
                        onPress={() => {
                            setSelectedReport(item);
                            setChatVisible(true); 
                            fetchChatMessages(item.userId);
                        }}
                    >
                        <Icon2 name="chatbox-outline" size={24} color="#202A44" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

  const filters = ['Submitted', 'In-Progress', 'Completed', 'Rejected'];

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity style={styles.btn}>
      <Text style={styles.btnText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.appName}>InfraSmart</Text>
      </View>
      
      {/* Filters using FlatList */}
      <FlatList
        data={filters}
        renderItem={renderFilterItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horScrollView}
      />

      {/* Reports List */}
      {loadingReports ? (
        <ActivityIndicator size="large" color="#202A44" />
      ) : reports.length > 0 ? (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyRep}>No reports available.</Text>
      )}

     {/* Error Overlay */}
<Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={styles.overlay} // Apply overlay style
>
<View style={styles.overlayContent}>
                    <Icon3 name="info" size={50} color="#000" style={styles.overlayIcon} />
                    <Text style={styles.overlayText}>{error}</Text>
                </View>
</Overlay>

{/* Confirmation Overlay (for Yes/No alerts) */}
<Overlay 
  isVisible={confirmationVisible} 
  onBackdropPress={() => setConfirmationVisible(false)} 
  overlayStyle={styles.overlay} // Apply overlay style
>
  <View style={styles.overlayContent}>
    <Text style={styles.overlayText}>Are you sure?</Text>
    <Pressable
      style={styles.button}
      onPress={() => {
        // Handle Yes action
        setConfirmationVisible(false);
      }}
    >
      <Text style={styles.buttonText}>Yes</Text>
    </Pressable>
    <Pressable
      style={styles.button}
      onPress={() => setConfirmationVisible(false)}
    >
      <Text style={styles.buttonText}>No</Text>
    </Pressable>
  </View>
</Overlay>

      {/* Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={chatVisible}
        onRequestClose={() => {
          setChatVisible(false);
        }}
      >
        <SafeAreaView style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: auth?.currentUser?.email,
              avatar: 'https://i.pravtart.cc/300',
            }}
            messagesContainerStyle={{ backgroundColor: "#fff" }}
          />
          <Pressable
            style={styles.closeChatButton}
            onPress={() => setChatVisible(false)}
          >
            <Text style={styles.buttonText}>Close Chat</Text>
          </Pressable>
        </SafeAreaView>
      </Modal>
    </View>
  );
};




export default Reporting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2f9FB',
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#F2f9FB",
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginTop: 20,
  },
  list: {
    marginTop: 80, 
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "95%",
    marginBottom: 15,
    marginLeft: 10,
    shadowColor: '#202A44',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 3,
  },
  profileContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#202A44',
  },
  initials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202A44',
    textAlign: 'center',
    marginTop: 5,
  },
  reportContainer: {
    flex: 1,
  },
  reportImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    color: "#202A44"
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  iconButton: {
    marginRight: 15,
  },
  moreButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    color: '#202A44',
    fontWeight: 'bold',
  },
  horScrollView: {
    marginTop: 100,
  },
  btn: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 184,
    height: 50,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#202A44",
    marginLeft: 13,
  },
  btnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#202A44',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  closeChatButton: {
    padding: 15,
    backgroundColor: '#202A44',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  emptyRep:{
    fontSize:20,
    justifyContent:"center",
    textAlign:"center",
    marginBottom:"70%",
    color: "#202A44"
  },
  overlay: {
    width: '80%',
    height: 320,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#EAF1FF",
    alignItems: 'center',
    justifyContent: 'center',
},
overlayContent: {
    alignItems: 'center',
},
overlayIcon: {
    marginBottom: 15,
},
overlayText: {
    fontSize: 16,
    textAlign: 'center',
},
});
