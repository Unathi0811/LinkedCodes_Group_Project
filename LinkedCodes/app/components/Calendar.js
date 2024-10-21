// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
// import { Agenda } from 'react-native-calendars';
// import Icon from 'react-native-vector-icons/Feather';
// import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
// import { firestore } from '../Components/Firebase'; // Ensure to import Firestore
// import { appauth } from '../Components/Firebase'; // Import Firebase Auth
// import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for offline storage
// import { Overlay } from '@rneui/themed';

// const Calendar = () => {
//   const [userId, setUserId] = useState(null); // State for user ID
//   const getCurrentDate = () => {
//     const today = new Date();
//     return today.toISOString().split('T')[0];
//   };

//   const [items, setItems] = useState({});
//   const [selectedDate, setSelectedDate] = useState(getCurrentDate());
//   const [modalVisible, setModalVisible] = useState(false);
//   const [newActivity, setNewActivity] = useState('');
//   const [visible, setVisible] = useState(false);
//   const [overlayMessage, setOverlayMessage] = useState('');

//   // Fetch user ID on mount
//   useEffect(() => {
//     const user = appauth.currentUser; // Get the current user
//     if (user) {
//       setUserId(user.uid); // Set user ID if user is logged in
//     } else {
//       console.error('User is not logged in'); // Handle the case when the user is not logged in
//     }
//   }, []);

//   // Fetch activities when userId is set
//   useEffect(() => {
//     if (userId) {
//       fetchActivities(userId); // Fetch activities for the logged-in user
//     }
//   }, [userId]);

//   const fetchActivities = async (userId) => {
//     const activities = {};
//     try {
//       const q = query(collection(firestore, 'activities'), where('userId', '==', userId)); // Filter by user ID
//       const querySnapshot = await getDocs(q);
//       querySnapshot.forEach((doc) => {
//         const { date, name, time } = doc.data();
//         let formattedTime = '';
//         if (time && time.toDate) {
//           formattedTime = time.toDate().toLocaleString();
//         }
//         if (!activities[date]) {
//           activities[date] = [];
//         }
//         activities[date].push({ name, time: formattedTime, height: 70 });
//       });
//       setItems(activities);
//       await AsyncStorage.setItem('activities', JSON.stringify(activities)); // Save activities to AsyncStorage
//     } catch (error) {
//       console.error('Error fetching activities: ', error);
//     }
//   };

//   const loadOfflineActivities = async () => {
//     const storedActivities = await AsyncStorage.getItem('activities');
//     if (storedActivities) {
//       setItems(JSON.parse(storedActivities)); // Load activities from AsyncStorage
//     }
//   };

//   useEffect(() => {
//     loadOfflineActivities(); // Load offline activities when component mounts
//   }, []);

//   const addActivity = async () => {
//     if (newActivity.trim() === '') {
//       setOverlayMessage('Activity cannot be empty.');
//       setVisible(true);
//       return;
//     }

//     try {
//       await addDoc(collection(firestore, 'activities'), {
//         userId, // Include userId when saving activity
//         date: selectedDate,
//         name: newActivity,
//         time: serverTimestamp(),
//       });
//       setModalVisible(false);
//       setNewActivity('');
//       fetchActivities(userId); // Reload activities from Firestore
//     } catch (error) {
//       setOverlayMessage('Error adding activity: ' + error.message);
//       setVisible(true);
//     }
//   };


//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <View style={{ flex: 1 }}>
//         <Agenda
//           items={items}
//           selected={selectedDate}
//           onDayPress={(day) => {
//             setSelectedDate(day.dateString);
//             setModalVisible(true);
//           }}
//           renderItem={(item) => (
//             <View style={styles.item}>
//               <Text>{item.name}</Text>
//               {item.time && <Text style={styles.timeText}>{item.time}</Text>}
//             </View>
//           )}
//           renderEmptyDate={() => (
//             <View style={styles.emptyDate}>
//               <Text style={styles.plannedActivity}>No Activities Scheduled</Text>
//             </View>
//           )}
//           theme={{
//             backgroundColor: '#EAF1FF',
//             selectedDayBackgroundColor: '#202A44',
//             todayTextColor: '#202A44',
//             dayTextColor: '#202A44',
//             dotColor: '#202A44',
//             arrowColor: '#202A44',
//             monthTextColor: '#808080',
//           }}
//         />

//         {/* Modal for adding a new activity */}
//         <Modal visible={modalVisible} animationType="slide">
//           <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//             <View style={styles.modalContent}>
//               <Text style={styles.title}>Schedule Maintenance</Text>
//               <Text style={styles.activityText}>Maintenance for {selectedDate}</Text>
//               <TextInput
//                 multiline
//                 style={styles.input}
//                 placeholder="Enter activity"
//                 value={newActivity}
//                 onChangeText={setNewActivity}
//               />
//               <View style={styles.buttons}>
//                 <TouchableOpacity onPress={addActivity}>
//                   <Text style={styles.buttonText}>Add Activity</Text>
//                 </TouchableOpacity>
//               </View>
//               <Icon
//                 style={styles.icon}
//                 name="chevron-left"
//                 size={45}
//                 color="#202A44"
//                 onPress={() => setModalVisible(false)}
//               />
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>

//         <Overlay isVisible={visible} onBackdropPress={() => setVisible(false)} overlayStyle={styles.overlay}>
//           <View style={styles.overlayContent}>
//             <Icon name="info" size={50} color="#000" style={styles.overlayIcon} />
//             <Text style={styles.overlayText}>{overlayMessage}</Text>
//           </View>
//         </Overlay>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   item: {
//     backgroundColor: '#EAF1FF',
//     padding: 10,
//     marginRight: 10,
//     marginTop: 17,
//     borderRadius: 5,
//     shadowColor: '#202A44',
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 2, height: 2 },
//     shadowRadius: 4,
//   },
//   emptyDate: {
//     padding: 10,
//     marginRight: 10,
//     marginTop: 17,
//     backgroundColor: '#F0F0F0',
//     borderRadius: 5,
//   },
//   modalContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#EAF1FF',
//   },
//   input: {
//     borderColor: "#000",
//     borderWidth: 2,
//     height: 100,
//     borderRadius: 30,
//     width: "90%",
//     marginTop: 10,
//     padding: 5,
    
//   },
//   buttons: {
//    width: "90%",
//     height: 52,
//     backgroundColor: "#202A44",
//     borderRadius: 10,
//     marginTop: 20,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   activityText: {
//     fontSize: 16,
//     marginTop:90,
//     color: '#202A44',
//   },
//   title: {
//     color: '#202A44',
//     marginTop: 79,
//     textAlign: 'center',
//     fontSize: 40,
//     fontWeight: 'bold',
//     marginBottom: 40,
//     marginTop:40
//   },
  
//   buttonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   icon: {
//     alignSelf: 'flex-start',
//     marginTop: 250,
//   },
//   plannedActivity: {
//     color: '#202A44',
//     fontSize: 15,
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#000', },
//   overlay: {
//     width: '80%',
//     height: 320,
//     borderRadius: 10,
//     padding: 20,
//     backgroundColor: "#EAF1FF",
//     alignItems: 'center',
//     justifyContent: 'center',
// },
// overlayContent: {
//     alignItems: 'center',
// },
// overlayIcon: {
//     marginBottom: 15,
// },
// overlayText: {
//     fontSize: 16,
//     textAlign: 'center',
// },
  

// });

// export default Calendar;