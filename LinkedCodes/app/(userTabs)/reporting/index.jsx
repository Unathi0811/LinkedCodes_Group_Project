import { View, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, StyleSheet, TextInput, FlatList, Modal,ActivityIndicator, Button} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect, useRef} from "react";
//import { v4 as uuidv4 } from "uuid"; // For generating unique filenames
import useLocation from "../../../src/components/useLocation";
import NetInfo from "@react-native-community/netinfo"; // To detect online status
import { Overlay } from "@rneui/themed";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For offline storage
import { db, storage, auth} from "../../../firebase"; 
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc, query, where, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import {Link } from 'expo-router'

export default function Reporting() {
  const { latitude, longitude } = useLocation();
  const [image, setImage] = useState(null);
  const [input, setInput] = useState("");
  const [reports, setReports] = useState([]); // Array to store reports
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("");
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [urgency, setUrgency] = useState("Low"); // Default urgency level
const [loading, setLoading] = useState(false); // For submit button loading
const [imageLoading, setImageLoading] = useState(true); // For image loading
const [showAd, setShowAd] = useState(false); // Ad visibility
  const [isSubscribed, setIsSubscribed] = useState(false); // Subscription status
  const inactivityTimeoutRef = useRef(null)

 

  // Get the current user ID
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Toggle overlay for error messages
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // Check if the app is online
  const checkIfOnline = async () => {
    const state = await NetInfo.fetch();
    return state.isConnected;
  };

  // Load reports from Firestore in real-time (if online) or from AsyncStorage (if offline)
  const loadReportsFromFirestore = () => {
    if (!userId) return; // Exit if no user is authenticated

    // const q = collection(db, "reports"); // Query the reports collection
    const q = query(collection(db, "reports"), where("userId", "==", userId))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedReports = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
      // .filter((report) => report.userId === userId); // Filter by userId
      setReports(loadedReports);
    }, (error) => {
      console.log("Error loading reports from Firestore: ", error);
    });

    return unsubscribe; // Return unsubscribe function
  };

  // Load reports from AsyncStorage (when offline)
  const loadReportsFromLocalStorage = async () => {
    try {
      const storedReports = await AsyncStorage.getItem("offlineReports");
      if (storedReports) {
        setReports(JSON.parse(storedReports));
      }
    } catch (error) {
      console.error("Error loading reports from local storage:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const isOnline = await checkIfOnline();
      if (isOnline && userId) {
        const unsubscribe = loadReportsFromFirestore(); // Load reports in real-time
        return () => unsubscribe(); // Cleanup listener on unmount
      } else {
        // Load locally stored reports if offline
        await loadReportsFromLocalStorage();
      }
    };

    fetchData();
  }, [userId]);

  // Sync offline reports to Firebase when the device goes online
  const syncOfflineReports = async () => {
    try {
      const storedReports = await AsyncStorage.getItem("offlineReports");
      if (storedReports) {
        const reportsArray = JSON.parse(storedReports);
        for (const report of reportsArray) {
          const imageRef = ref(storage, `images/${report.id}.jpg`);
          const response = await fetch(report.image);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          const imageUrl = await getDownloadURL(imageRef);

          // Update the report with the correct image URL
          const updatedReport = { ...report, image: imageUrl };
          await setDoc(doc(firestore, "reports", report.id), updatedReport);
        }

        // Clear offline reports after successful sync
        await AsyncStorage.removeItem("offlineReports");
        console.log("Offline reports synced to Firebase");
      }
    } catch (error) {
      console.error("Error syncing offline reports:", error);
    }
  };

  useEffect(() => {
    // Listen for network changes and sync offline data when back online
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        // Sync offline reports to Firebase
        await syncOfflineReports();
      }
    });

    return () => unsubscribe(); // Cleanup network listener on unmount
  }, []);

  // Submit report to Firestore (or AsyncStorage if offline)
  const submitReport = async () => {
    if (image && input && userId && urgency) {
      try {
        // const newReportId = uuidv4();
        setLoading(true);
        const newReport = {
          // id: newReportId,
          image, // Save the local image URI for now
          description: input,
          timestamp: new Date(),
          latitude,
          longitude,
          userId, // Include the authenticated user's ID
          urgency
        };

        // Check network status
        const isOnline = await checkIfOnline();

        if (isOnline) {
          // If online, upload image and report to Firebase
          const imageRef = ref(storage, `images/`);
          const response = await fetch(image);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);

          const imageUrl = await getDownloadURL(imageRef);
          newReport.image = imageUrl; // Update image URL after upload

          // Add the new report to Firestore
          await addDoc(collection(db, "reports"), newReport);
          setLoading(false)
        } else {
          // If offline, save the report locally using AsyncStorage
          const storedReports = await AsyncStorage.getItem("offlineReports");
          const reportsArray = storedReports ? JSON.parse(storedReports) : [];
          reportsArray.push(newReport);

          await AsyncStorage.setItem("offlineReports", JSON.stringify(reportsArray));
          console.log("Report saved offline");
        }

        // Clear input and close modal
        setImage(null);
        setInput("");
        setModalVisible(false);
      } catch (error) {
        setOverlayMessage("Error submitting report: " + error.message);
        setVisible(true);
      }
    } else {
      setOverlayMessage("Please add both an image, description and select urgency level");
      setVisible(true);
    }
  };
// ads
  useEffect(() => {
    const checkSubscription = async () => {
      const subscriptionStatus = await AsyncStorage.getItem(`isSubscribed_${userId}`);
      if (subscriptionStatus === 'true') {
        setIsSubscribed(true);
        setShowAd(false); // Disable ads if subscribed
      } else {
        setShowAd(true);
      }
    };
    if (userId) checkSubscription();
  }, [userId]);

  const handleActivity = () => {
    clearTimeout(inactivityTimeoutRef.current);
    if (!isSubscribed) {
      inactivityTimeoutRef.current = setTimeout(() => setShowAd(true), 5000); // Show ad only if not subscribed
    }
  };

  

  // Delete a report from Firebase (if online)
  const deleteReport = async (reportId, imageUri, userId) => {
    try {
      // Check if online before deleting from Firebase
      const isOnline = await checkIfOnline();
      if (isOnline) {
        console.log("Deleting report from Firebase...");
        const reportRef = doc(db, "reports", reportId); // Access the specific document
        await deleteDoc(reportRef); // Delete the document
  
        // Delete image from Firebase Storage if it exists
        if (imageUri && userId) {
          console.log("Image URI before deletion:", imageUri);
  
          // Construct the path based on the userId and image file
          const userImagePath = `users/${userId}/images/${imageUri}`;
  
          const imageRef = ref(storage, userImagePath); // Get reference to the user's image
          await deleteObject(imageRef); // Delete the image
          console.log("Image deleted from Firebase Storage");
        }
  
        console.log("Report and associated image deleted from Firebase");
      }
  
      setOverlayMessage("Report successfully deleted.");
      setVisible(true);
    } catch (error) {
      console.error("Error deleting report: ", error);
      setOverlayMessage("Error deleting report: " + error.message);
      setVisible(true);
    }
  };
  

  // Upload image from camera or gallery
  const uploadImage = async (mode) => {
    try {
      let result = {};
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }
      if (!result.canceled) {
        saveImage(result.assets[0].uri);
      }
    } catch (error) {
      setOverlayMessage("Error uploading image: " + error.message);
      setVisible(true);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  // Save image URI locally
  const saveImage = (imageUri) => {
    setImage(imageUri);
  };

  // Show report details modal when a report is clicked
  const openReportDetails = (report) => {
    setSelectedReport(report);
    setModalVisible2(true);
  };

  // Close report details modal
  const closeReportDetails = () => {
    setSelectedReport(null);
    setModalVisible2(false);
  };

  // Render individual report item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openReportDetails(item)}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        <Text>{item.description}</Text>
        <Text>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
       

        {/* Modal for upload options */}
        <Modal transparent={true} visible={modalVisible} animationType="slide">
          <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
              <Text style={styles.modalHeader}>Upload Options</Text>
              <View style={styles.modalButtons}>
                <View style={styles.modalButtonsin}>
                  <TouchableOpacity onPress={() => uploadImage("camera")}>
                    <Icon name="camera" size={40} color={"#000"} />
                    <Text style={styles.icontext}>Camera</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalButtonsin}>
                  <TouchableOpacity onPress={() => uploadImage("gallery")}>
                    <Icon name="image" size={40} color={"#000"} />
                    <Text style={styles.icontext}>Gallery</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalButtonsin}>
                  <TouchableOpacity onPress={removeImage}>
                    <Icon name="trash-2" size={40} color={"#000"} />
                    <Text style={styles.icontext}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Report Submission UI */}
        <Text style={styles.imageheader}>Upload Image</Text>
        {image ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
        ) : (
          <Icon onPress={() => setModalVisible(true)} name="camera" size={70} color={"#000"} />
        )}

        <TextInput
          multiline
          keyboardType="default"
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Description"
        />
          {/*this is the urgency dropdown*/}

          <Text style={styles.urgencyLabel}>Select Urgency Level:</Text>
  <View style={styles.urgencyDropdown}>
    <TouchableOpacity onPress={() => setUrgency("Low")} style={styles.urgencyOption(urgency === "Low")}>
      <Text>Low</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setUrgency("Medium")} style={styles.urgencyOption(urgency === "Medium")}>
      <Text>Medium</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setUrgency("High")} style={styles.urgencyOption(urgency === "High")}>
      <Text>High</Text>
    </TouchableOpacity>
  </View>
        <TouchableOpacity style={styles.button} onPress={submitReport}>
        {loading ? (
        <ActivityIndicator size="small" color="#EAF1FF" />
      ) : (
        <Text><Text style={styles.buttonText}>Submit Report</Text></Text>
      )}
        </TouchableOpacity>
        <Link href="/(userTabs)/reporting/userChat" asChild>
    <TouchableOpacity>
      <Text>User Chat</Text>
    </TouchableOpacity>
  </Link>

        {/* Historical Reports */}
        <View style={styles.container2}>
          <Text style={styles.Heading2}>Historical Reports</Text>
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openReportDetails(item)}>
                <View style={styles.reportItem}>
                <Image source={{ uri: item.image }} style={styles.imageThumbnail} />
                  <View style={styles.textContainer}>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.timestamp}>{item.timestamp.toDate().toLocaleString()}</Text>
                    <Text style={styles.urgency}>Urgency: {item.urgency}</Text> 
                  </View>
                  <TouchableOpacity onPress={() => deleteReport(item.id, item.image)}>
                    <Icon name="trash" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Overlay for error messages */}

        <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlay}>
          <View style={styles.overlayContent}>
            <Icon name="info" size={50} color="#000" style={styles.overlayIcon} />
            <Text style={styles.overlayText}>{overlayMessage}</Text>
          </View>
        </Overlay>

            {/*This is for the add*/}
			<Modal visible={showAd && !isSubscribed} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <Text>wala wala wee wadiweleeeee</Text>
            <Link href="/home/premium/" asChild>
              <TouchableOpacity
              >
                <Text style={{ color: 'black', marginTop: 20 }}>Subscribe to Premuim</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity onPress={() => setShowAd(false)}>
              <Text style={{ color: 'black', marginTop: 20 }}>Close Ad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

        {/* Modal for report details */}
        <Modal transparent={true} visible={modalVisible2} animationType="slide">
          <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible2(false)}>
            <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
              {selectedReport && (
                <>
                  <Text style={styles.modalHeader}>Report Details</Text>
                  <Text style={styles.description}>Description: {selectedReport.description}</Text>
                  <Text style={styles.timestamp}>
                    Date: {selectedReport.timestamp.toDate().toLocaleString()}
                  </Text>
                  <Text style={styles.urgency}>Urgency: {selectedReport.urgency}</Text>
                  <Text style={styles.status}>
                    Status: {selectedReport.status || 'No Status'}
                  </Text>
                  
                </>
              )}
              <TouchableOpacity style={styles.button} onPress={() => setModalVisible2(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#EAF1FF",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 50,
  },
  input: {
    borderColor: "#000",
    
    height: 100,
    
    width: "90%",
    marginTop: 10,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
   
    elevation: 5,
    
    fontSize: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#202A44",
  },
  container2: {
    flex: 2,
    width: "100%",
    backgroundColor: "#EAF1FF",
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 50,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    elevation: 5,
    fontSize: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#202A44",
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 30,
  },
  text: {
    fontSize: 15,
    paddingRight: 15,
    paddingLeft: 20,
  },

  Heading2: {
    color: "#202A44",
    marginTop: 40,
    textAlign: "center",
    fontSize: 30,
  },
  button: {
    padding:12,
    backgroundColor: "#202A44",
    borderRadius: 12,
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202A44",
    paddingVertical: 13,
    marginHorizontal: 20,
    width: "90%",
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#202A44",
    
  },
  buttonText: {
    fontSize: 18,
    
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    height: 320,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#EAF1FF",
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalButtons: {
    justifyContent: "space-around",
    flexDirection: "row",
    width: "100%",
  },
  modalButtonsin: {
    backgroundColor: "#EAF1FF",
    borderRadius: 10,
    width: 70,
    alignItems: "center",
    padding: 10,
  },
  modalHeader: {
    textAlign: "center",
    fontSize: 30,
    color: "#202A44",
    fontWeight: "bold",
    marginBottom: 20,
  },
  textContainer: {
    flex: 1, // Make the text container flexible to allow wrapping
    paddingLeft: 20,
    paddingRight: 10,
  },
  imageheader: {
   
    fontSize: 20
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
  icontext: {
    textAlign: "justify",
    fontSize: 11
  },
  status: {
    marginTop: 10,
    fontWeight: "bold",
  },
  urgencyOption: (isSelected) => ({
    padding: 10,
    borderWidth: 1,
    borderColor: isSelected ? "#202A44" : "grey", // Highlight selected option
    backgroundColor: isSelected ? "#BFDBF7" : "#EAF1FF",
    marginVertical: 5,
    borderRadius: 5,
  }),

  urgencyLabel: {
    marginTop: 10,
    marginBottom: 5,
    
  },

  urgencyDropdown: {
    flexDirection:"row",
    justifyContent:"space-evenly",
    width:"100%"

  },
});