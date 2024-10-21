import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Pressable, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { db, auth,} from '../../../firebase'; 
import { collection, getDocs, addDoc, onSnapshot, query, orderBy, where, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/Feather";
import Icon4 from 'react-native-vector-icons/FontAwesome'
import { GiftedChat } from "react-native-gifted-chat";
import { Overlay } from "@rneui/themed";
import Geocoder from 'react-native-geocoding'; // Import geocoding library

import { updateDoc } from 'firebase/firestore';

// Initialize the Geocoding API with your API key
Geocoder.init('AIzaSyAQ6VsdSIFTQYmic060gIGuGQQd2TW4jsw');

const Reporting = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationDescription, setLocationDescription] = useState('');
  const [selectedFilter, setSelectedFilter] = useState("Submitted");

 
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoadingReports(true);
        const reportsCollection = collection(db, 'reports');
        const reportSnapshot = await getDocs(reportsCollection);
        const reportList = await Promise.all(
          reportSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const locationDescription = data.latitude && data.longitude
              ? await fetchLocationDescription(data.latitude, data.longitude)
              : 'Location not available'; // Fetch location description for each report
            
            return {
              id: doc.id,
              ...data,
              locationDescription, // Attach the location description
            };
          })
        );

        console.log('Fetched Reports:', reportList);

        const filteredReports = reportList.filter(report => report.userId !== undefined);
        const userIds = [...new Set(filteredReports.map(report => report.userId))];

        const userPromises = userIds.map(async userId => {
          const userDoc = await getDoc(doc(db, 'user', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return { 
              userId, 
              name: userData.username, 
              profilePhoto: userData.profileImage || 'https://via.placeholder.com/60' // Default image if not set
            };
          }
          return { userId, name: 'Unknown User', profilePhoto: 'https://via.placeholder.com/60' }; // Placeholder image for missing users
        });

        const userData = await Promise.all(userPromises);
        const userMap = {};
        userData.forEach(user => {
          userMap[user.userId] = user; // Store user data (name and profilePhoto)
        });

        setUserNames(userMap);
        setReports(filteredReports);
      } catch (error) {
        console.error("Error fetching reports: ", error);
        setError("Could not load reports. Please try again later.");
        setOverlayVisible(true);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, []);

  const fetchLocationDescription = async (lat, long) => {
    try {
      const res = await Geocoder.from(lat, long);
      const address = res.results[0].formatted_address; // Assuming results[0] has the address
      return address;
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Unable to fetch location.";
    }
  };
  
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter === selectedFilter ? null : filter); // Toggle filter
  };

  const filteredReports = selectedFilter === 'Submitted'
  ? reports
  : selectedFilter
  ? reports.filter(report => report.status === selectedFilter)
  : [];
  //updating the report status 
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, 'reports', reportId); // Reference to the specific report
      await updateDoc(reportRef, {
        status: newStatus, // Update the status field
      });
      console.log(`Report ${reportId} updated to ${newStatus}`);
      
      // Optionally, you can update the local state or show a success message
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (error) {
      console.error("Error updating report status: ", error);
      setError("Could not update report status. Please try again later.");
      setOverlayVisible(true); // Show overlay for errors
    }
  };

  // Fetch chat messages for the selected report
  const fetchChatMessages = (reportCreatorId) => {
    const currentUserId = auth.currentUser.uid;
    const chatId = [reportCreatorId, currentUserId].sort().join('_');

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


  const statusIcons = {
    Submitted: 'file-text-o',
    'In-Progress': 'spinner',
    Completed: 'check-circle',
    
  };

  

  // For the location
  const showLocation = async (lat, long) => {
    setLatitude(lat);
    setLongitude(long);
    
    try {
      const res = await Geocoder.from(lat, long); // Get location description from latitude and longitude
      const address = res.results[0].formatted_address; // Assuming results[0] has the address
      setLocationDescription(address);
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationDescription("Unable to fetch location.");
    }

    setLocationModalVisible(true);
  };

  const onSend = useCallback((messages = []) => {
    const currentUserId = auth.currentUser.uid;
    const reportCreatorId = selectedReport.userId;
    const chatId = [reportCreatorId, currentUserId].sort().join('_');

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(db, 'chats'), {
        _id,
        createdAt,
        text,
        user,
        chatId,
    });
}, [selectedReport]);

  const renderItem = ({ item }) => {
    const user = userNames[item.userId] || { name: 'Unknown User', profilePhoto: 'https://via.placeholder.com/60' }; // Default values for unknown users
  
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: user.profilePhoto }} // Display the user profile picture
            style={styles.profileImage} 
          />
          <Text style={styles.initials}>{user.name}</Text>
        </View>
        <View style={styles.reportContainer}>
          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
            style={styles.reportImage} 
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
          />
          <Text style={styles.description}>Descption: {item.description || 'No description available.'}</Text>
          
          {/* Display location directly under the description */}
          {item.latitude && item.longitude && (
            <Text style={styles.description}>
             Location: {item.locationDescription || 'No location available'}
            </Text>
          )}
  
         
            <Text style={styles.description}>Status: </Text>
          {/* Status Update Icons */}
          <View style={styles.statusIcons}>
            <TouchableOpacity onPress={() => updateReportStatus(item.id, 'In-Progress')}>
              <Icon4 name="spinner" size={20} color={item.status === 'In-Progress' ? '#202A44' : '#ccc'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateReportStatus(item.id, 'Completed')}>
              <Icon4 name="check-circle" size={20} color={item.status === 'Completed' ? '#202A44' : '#ccc'} />
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
           
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

  const filters = ['Submitted', 'In-Progress', 'Completed',];

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
    style={styles.btn}
    onPress={() => handleFilterChange(item)} // Ensure handleFilterChange exists
  >
    {/* Ensure that statusIcons[item] exists and is valid */}
    {statusIcons[item] && (
      <Icon4 name={statusIcons[item]} size={16} color="#fff" />
    )}

    {/* Text wrapped in <Text> */}
    <Text style={styles.btnText}>{item.toString()}</Text>
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
    ) : filteredReports.length > 0 ? (
      <FlatList
        data={filteredReports}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    ) : selectedFilter !== 'Submitted' ? (
      <Text style={styles.emptyRep}>No reports available for this status.</Text>
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
      <Overlay isVisible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)} overlayStyle={styles.overlay}>
        <View style={styles.overlayContent}>
          <Icon3 name="info" size={50} color="#000" style={styles.overlayIcon} />
          <Text style={styles.overlayText}>{error}</Text>
        </View>
      </Overlay>

      {/* Confirmation Overlay */}
      <Overlay isVisible={confirmationVisible} onBackdropPress={() => setConfirmationVisible(false)} overlayStyle={styles.overlay}>
        <Text>Confirmation Message</Text>
      </Overlay>

      {/* Chat Modal */}
      <Modal
        visible={chatVisible}
        onRequestClose={() => setChatVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat with {userNames[selectedReport?.userId]?.name || 'Unknown User'}</Text>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <Icon2 name="close" size={24} color="#202A44" />
            </TouchableOpacity>
          </View>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
              _id: auth.currentUser.uid, // Current user's ID
            }}
            renderLoading={() => <ActivityIndicator size="large" color="#202A44" />}
          />
          {loadingChat && <ActivityIndicator size="large" color="#202A44" />}
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
    width: 200,
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
    justifyContent: "flex-end",
    marginTop: 50,
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
locationContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
},
locationText: {
  fontSize: 18,
  color: '#fff',
  marginBottom: 20,
},
closeLocationButton: {
  backgroundColor: '#202A44',
  padding: 10,
  borderRadius: 5,
},
statusIcons:{
  flexDirection:"row",
  justifyContent:"space-evenly"
},
chatContainer: {
  flex: 1,
  padding: 10,
  backgroundColor: '#FFFFFF',
},
chatHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 10,
  backgroundColor: '#F0F0F0',
  borderRadius: 8,
  marginBottom: 10,
},
chatTitle: {
  fontSize: 18,
  fontWeight: 'bold',
},
});
