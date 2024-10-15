import {View,Image,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Text,StyleSheet,TextInput,FlatList,Modal,ActivityIndicator} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // For generating unique filenames
import useLocation from "../components/useLocation";
import NetInfo from "@react-native-community/netinfo"; // To detect online status
import { Overlay } from "@rneui/themed";
import AsyncStorage from '@react-native-async-storage/async-storage'; // For offline storage
import { db, storage } from "../../firebase"; // Import Firebase
import {collection,onSnapshot,doc,setDoc,deleteDoc,} from "firebase/firestore";
import {ref,uploadBytes,getDownloadURL,deleteObject} from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

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
  const auth = getAuth(); // Get the current authenticated user
  const [loading, setLoading] = useState(false); 

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

    const q = collection(db, "reports"); // Query the reports collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedReports = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((report) => report.userId === userId); // Filter by userId
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
          await setDoc(doc(db, "reports", report.id), updatedReport);
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
    if (image && input && userId) {
      try {
        setLoading(true)
        const newReportId = uuidv4();
        const newReport = {
          id: newReportId,
          image, // Save the local image URI for now
          description: input,
          timestamp: new Date(),
          latitude,
          longitude,
          userId, // Include the authenticated user's ID
        };

        // Check network status
        const isOnline = await checkIfOnline();

        if (isOnline) {
          // If online, upload image and report to Firebase
          const imageRef = ref(storage, `images/${newReportId}.jpg`);
          const response = await fetch(image);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);

          const imageUrl = await getDownloadURL(imageRef);
          newReport.image = imageUrl; // Update image URL after upload

          // Add the new report to Firestore
          await setDoc(doc(db, "reports", newReportId), newReport);
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
      } finally {
        setLoading(false); // Set loading to false when done
      }
    } else {
      setOverlayMessage("Please add both an image and a description.");
      setVisible(true);
    }
  };

  // Delete a report from Firebase (if online)
  const deleteReport = async (reportId, imageUri) => {
    try {
      // Check if online before deleting from Firebase
      const isOnline = await checkIfOnline();
      if (isOnline) {
        console.log("Deleting report from Firebase...");
        const reportRef = doc(db, "reports", reportId); // Access the specific document
        await deleteDoc(reportRef); // Delete the document

        // Delete image from Firebase Storage if it exists
        if (imageUri) {
          const imageRef = ref(storage, imageUri); // Use ref to get a reference to the image
          await deleteObject(imageRef); // Delete the image
        }

        console.log("Report deleted from Firebase");
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
      {loading ? ( // Show Activity Indicator when loading
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <>
          <Text>{item.description}</Text>
          <Text>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
        </>
      )}
    </View>
  </TouchableOpacity>
);
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.Heading}>Reporting</Text>

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

<TouchableOpacity style={styles.button} onPress={submitReport} disabled={loading}>
        {loading ? ( // Show Activity Indicator when loading
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Submit Report</Text>
        )}
      </TouchableOpacity>

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
    borderWidth: 2,
    height: 100,
    borderRadius: 10,
    width: "90%",
    marginTop: 10,
    padding: 5,
    
    
  },
  container2: {
    flex: 2,
    width: "100%",
    backgroundColor: "#EAF1FF",
  },
  reportItem: {
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
    elevation: 3,}
  ,
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
  Heading: {
    color: "#202A44",
    marginTop: 79,
    textAlign: "center",
    fontSize: 40,
  
    marginBottom: 50,
  },
  Heading2: {
    color: "#202A44",
    marginTop: 79,
    textAlign: "center",
    fontSize: 40,
    
  },
  button: {
    width: "90%",
    height: 52,
    backgroundColor: "#202A44",
    borderRadius: 10,
    marginTop: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
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
});

