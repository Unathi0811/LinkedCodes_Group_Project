import {
    View,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Modal,
  } from "react-native";
  import { Link } from "expo-router";
  import * as ImagePicker from "expo-image-picker";
  import Icon from "react-native-vector-icons/Feather";
  import React, { useState, useEffect } from "react";
  import { v4 as uuidv4 } from "uuid";
  import useLocation from "../../components/useLocation";
  import NetInfo from "@react-native-community/netinfo";
  import { Overlay } from "@rneui/themed";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { db, storage } from "../../../firebase";
  import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    deleteDoc,
  } from "firebase/firestore";
  import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
  } from "firebase/storage";
  import { useUser } from "../../../src/cxt/user";
  
  export default function Reporting() {
    const { latitude, longitude } = useLocation();
    const [image, setImage] = useState(null);
    const [input, setInput] = useState("");
    const [reports, setReports] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [overlayMessage, setOverlayMessage] = useState("");
    const [modalVisible2, setModalVisible2] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const { user } = useUser();
    // Get the current user ID from the user context
    const userId = user ? user.uid : null;
  
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
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const loadedReports = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((report) => report.userId === userId); // Filter by userId
          setReports(loadedReports);
        },
        (error) => {
          console.log("Error loading reports from Firestore: ", error);
        }
      );
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
  
            await AsyncStorage.setItem(
              "offlineReports",
              JSON.stringify(reportsArray)
            );
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
  
    // Confirm before deleting a report
    const confirmDelete = (report) => {
      setModalVisible2(true);
      setSelectedReport(report);
    };
  
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="plus" size={30} color="#fff" />
          </TouchableOpacity>
  
          <View style={styles.container}>
            <Text>Home screen</Text>
            <Link href="/modal" style={styles.link}>
              Open modal
            </Link>
          </View>
  
          {/* FlatList to display reports */}
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.reportItem}
                onPress={() => console.log("Report selected:", item)}
              >
                <Image source={{ uri: item.image }} style={styles.reportImage} />
                <View style={styles.reportInfo}>
                  <Text style={styles.reportDescription}>{item.description}</Text>
                  <TouchableOpacity
                    onPress={() => confirmDelete(item)}
                    style={styles.deleteButton}
                  >
                    <Icon name="trash-2" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
  
          {/* Add Report Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Create a Report</Text>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <TouchableOpacity
                  onPress={() => uploadImage("gallery")}
                  style={styles.imagePicker}
                >
                  <Text style={styles.imagePickerText}>Pick an image</Text>
                </TouchableOpacity>
              )}
              <TextInput
                style={styles.textInput}
                placeholder="Description"
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity
                onPress={submitReport}
                style={styles.submitButton}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Modal>
  
          {/* Delete Confirmation Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => {
              setModalVisible2(false);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.confirmationModal}>
                <Text style={styles.confirmationText}>
                  Are you sure you want to delete this report?
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      deleteReport(selectedReport.id, selectedReport.image);
                      setModalVisible2(false);
                    }}
                    style={styles.modalDeleteButton}
                  >
                    <Text style={styles.modalDeleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setModalVisible2(false)}
                    style={styles.modalCancelButton}
                  >
                    <Text style={styles.modalCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
  
          {/* Overlay for error messages */}
          <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <Text>{overlayMessage}</Text>
          </Overlay>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: "#EAF1FF",
      alignItems: "center",
      justifyContent: "center",
    },
    addButton: {
      position: "absolute",
      bottom: 20,
      right: 20,
      width: 60,
      height: 60,
      backgroundColor: "#202A44",
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    reportItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#202A44",
      padding: 10,
      marginBottom: 20,
      backgroundColor: "#fff",
    },
    reportImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
    },
    reportInfo: {
      flex: 1,
      marginLeft: 10,
      justifyContent: "center",
    },
    reportDescription: {
      fontSize: 16,
      color: "#202A44",
      fontWeight: "bold",
    },
    deleteButton: {
      padding: 10,
    },
    modalView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "80%",
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    modalText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#202A44",
      marginBottom: 20,
    },
    imagePreview: {
      width: 150,
      height: 150,
      marginBottom: 20,
      borderRadius: 10,
    },
    imagePicker: {
      width: "80%",
      padding: 15,
      backgroundColor: "#EAF1FF",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginBottom: 20,
    },
    imagePickerText: {
      fontSize: 16,
      color: "#202A44",
    },
    textInput: {
      width: "100%",
      height: 50,
      borderWidth: 1,
      borderColor: "#202A44",
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      backgroundColor: "#fff",
    },
    submitButton: {
      width: "80%",
      height: 50,
      backgroundColor: "#202A44",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
    submitButtonText: {
      fontSize: 16,
      color: "#fff",
      fontWeight: "bold",
    },
    confirmationModal: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    confirmationText: {
      fontSize: 18,
      color: "#202A44",
      marginBottom: 20,
    },
    modalButtonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    modalDeleteButton: {
      backgroundColor: "red",
      padding: 15,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      marginRight: 10,
    },
    modalDeleteButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    modalCancelButton: {
      backgroundColor: "#202A44",
      padding: 15,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    modalCancelButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    link: {
      paddingTop: 20,
      fontSize: 20,
    },
  });