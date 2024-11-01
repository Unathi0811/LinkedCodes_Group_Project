import { View, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, StyleSheet, TextInput, FlatList, Modal,ActivityIndicator, Button} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect, useRef} from "react";
import useLocation from "../../../src/components/useLocation";
import NetInfo from "@react-native-community/netinfo";
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
		const q = query(
			collection(db, "reports"),
			where("userId", "==", userId)
		);
		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const loadedReports = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				// .filter((report) => report.userId === userId); // Filter by userId
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
					await setDoc(
						doc(firestore, "reports", report.id),
						updatedReport
					);
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
				setLoading(true);

				// Determine report_type and accident_report based on selected category
				let reportType = null;
				let accidentReport = false;

				if (category === "Accident") {
					accidentReport = true; // Set to true if category is Accident
				} else if (category === "Road") {
					reportType = "Road"; // Set report_type to Road
				} else if (category === "Bridge") {
					reportType = "Bridge"; // Set report_type to Bridge
				}

				const newReport = {
					image, // Save the local image URI for now
					description: input,
					timestamp: new Date(),
					latitude,
					longitude,
					userId, // Include the authenticated user's ID
					urgency,
					report_type: reportType, // Set report_type based on selected category
					accident_report: accidentReport, // Set accident_report based on selected category
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
					setLoading(false);
				} else {
					// If offline, save the report locally using AsyncStorage
					const storedReports = await AsyncStorage.getItem(
						"offlineReports"
					);
					const reportsArray = storedReports
						? JSON.parse(storedReports)
						: [];
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
			setOverlayMessage(
				"Please add both an image, description and select urgency level"
			);
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
				console.log(
					"Report and associated image deleted from Firebase"
				);
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
				<Text>
					{new Date(item.timestamp.seconds * 1000).toLocaleString()}
				</Text>
			</View>
		</TouchableOpacity>
	);
	const router = useRouter();

	return (
		<TouchableWithoutFeedback
			onPress={Keyboard.dismiss}
			accessible={false}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: "#F2f9FB",
				}}
			>
				<View style={styles.header}>
					{/* Back Button */}
					<TouchableOpacity
						onPress={() => router.push("/(userTabs)/home")}
						style={styles.backButton}
					>
						<Icon3
							name="arrow-left"
							size={24}
							color="#202A44"
						/>
					</TouchableOpacity>
					<Text style={styles.headerApp}>InfraSmart</Text>
				</View>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						alignContent: "center",
						alignItems: "center",
					}}
					style={{
						flex: 1,
						backgroundColor: "#F2f9FB",
						marginTop: 10,
						height: "auto",
					}}
				>
					{/* Modal for upload options */}
					<Modal
						transparent={true}
						visible={modalVisible}
						animationType="slide"
					>
						<TouchableOpacity
							style={styles.modalBackground}
							onPress={() => setModalVisible(false)}
						>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.modalContainer}
							>
								<Text style={styles.modalHeader}>
									Upload Options
								</Text>
								<View style={styles.modalButtons}>
									<View style={styles.modalButtonsin}>
										<TouchableOpacity
											onPress={() =>
												uploadImage("camera")
											}
										>
											<Icon
												name="camera"
												size={40}
												color={"#000"}
											/>
											<Text style={styles.icontext}>
												Camera
											</Text>
										</TouchableOpacity>
									</View>
									<View style={styles.modalButtonsin}>
										<TouchableOpacity
											onPress={() =>
												uploadImage("gallery")
											}
										>
											<Icon
												name="image"
												size={40}
												color={"#000"}
											/>
											<Text style={styles.icontext}>
												Gallery
											</Text>
										</TouchableOpacity>
									</View>
									<View style={styles.modalButtonsin}>
										<TouchableOpacity onPress={removeImage}>
											<Icon
												name="trash-2"
												size={40}
												color={"#000"}
											/>
											<Text style={styles.icontext}>
												Remove
											</Text>
										</TouchableOpacity>
									</View>
								</View>
								<TouchableOpacity
									style={styles.button}
									onPress={() => setModalVisible(false)}
								>
									<Text style={styles.buttonText}>Close</Text>
								</TouchableOpacity>
							</TouchableOpacity>
						</TouchableOpacity>
					</Modal>

					{/* Report Submission UI */}
					<Text style={styles.imageheader}>UPLOAD IMAGE</Text>

					{image ? (
						<TouchableOpacity onPress={() => setModalVisible(true)}>
							<Image
								source={{ uri: image, cache: "force-cache" }}
								style={styles.image}
							/>
						</TouchableOpacity>
					) : (
						<TouchableOpacity onPress={() => setModalVisible(true)}>
							<Icon
								name="camera"
								size={40}
								color={"#000"}
							/>
						</TouchableOpacity>
					)}

					<Text style={styles.descriptionText}>DESCRIPTION</Text>
					<TextInput
						multiline
						keyboardType="default"
						value={input}
						onChangeText={setInput}
						style={styles.input}
						placeholder="write the description here"
						numberOfLines={2}
					/>
					{/*this is the urgency dropdown*/}

					<Text style={styles.urgencyLabel}>
						SELECT URGENCY LEVEL
					</Text>
					<View style={styles.urgencyDropdown}>
						<RNPickerSelect
							onValueChange={(value, index) => setUrgency(value)}
							items={[
								{
									label: "Low",
									value: "Low",
									key: "Low",
									color: "#00FF00",
								},
								{
									label: "Medium",
									value: "Medium",
									key: "Medium",
									color: "#FFFF00",
								},
								{
									label: "High",
									value: "High",
									key: "High",
									color: "#FF0000",
								},
							]}
							placeholder={{
								label: "Select urgency...",
								value: null,
							}}
							style={{
								inputIOS: styles.pickerInput,
								inputAndroid: styles.pickerInput,
								iconContainer: styles.iconContainer,
								done: {
									color: "#202A44",
								},
							}}
							useNativeAndroidPickerStyle={false}
							Icon={() => {
								return (
									<Icon2
										name="arrow-drop-down"
										size={24}
										color="#202A44"
									/>
								);
							}}
							itemKey="key"
						/>
					</View>

					<Text style={styles.categoryLabel}>
						SELECT REPORT CATEGORY
					</Text>
					<View style={styles.urgencyDropdown}>
						<RNPickerSelect
							onValueChange={(value, index) => setCategory(value)}
							items={[
								{
									label: "Accident",
									value: "Accident",
									key: "Accident",
									color: "#202A44",
								},
								{
									label: "Road",
									value: "Road",
									key: "Road",
									color: "#202A44",
								},
								{
									label: "Bridge",
									value: "Bridge",
									key: "Bridge",
									color: "#202A44",
								},
							]}
							placeholder={{
								label: "Select a category...",
								value: null,
							}}
							style={{
								inputIOS: styles.pickerInput,
								inputAndroid: styles.pickerInput,
								iconContainer: styles.iconContainer,
								done: {
									color: "#202A44",
								},
							}}
							useNativeAndroidPickerStyle={false}
							Icon={() => {
								return (
									<Icon2
										name="arrow-drop-down"
										size={24}
										color="#202A44"
									/>
								);
							}}
							itemKey="key"
						/>
					</View>

					<TouchableOpacity
						style={styles.button}
						onPress={submitReport}
					>
						{loading ? (
							<ActivityIndicator
								size="small"
								color="#EAF1FF"
							/>
						) : (
							<Text>
								<Text style={styles.buttonText}>
									Submit Report
								</Text>
							</Text>
						)}
					</TouchableOpacity>
					<Link
						href="/(userTabs)/reporting/userChat"
						asChild
					>
						<TouchableOpacity style={styles.button}>
							<Text style={styles.buttonText}>User Chat</Text>
						</TouchableOpacity>
					</Link>
					{/* Overlay for error messages */}
					<Overlay
						isVisible={visible}
						onBackdropPress={toggleOverlay}
						overlayStyle={styles.overlay}
					>
						<View style={styles.overlayContent}>
							<Icon
								name="info"
								size={50}
								color="#000"
								style={styles.overlayIcon}
							/>
							<Text style={styles.overlayText}>
								{overlayMessage}
							</Text>
						</View>
					</Overlay>

					{/* Modal for report details */}
					<Modal
						transparent={true}
						visible={modalVisible2}
						animationType="slide"
					>
						<TouchableOpacity
							style={styles.modalBackground}
							onPress={() => setModalVisible2(false)}
						>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.modalContainer}
							>
								{selectedReport && (
									<>
										<Text style={styles.modalHeader}>
											Report Details
										</Text>
										<Text style={styles.description}>
											Description:{" "}
											{selectedReport.description}
										</Text>
										<Text style={styles.timestamp}>
											Date:{" "}
											{selectedReport.timestamp
												.toDate()
												.toLocaleString()}
										</Text>
										<Text style={styles.urgency}>
											Urgency: {selectedReport.urgency}
										</Text>
										<Text style={styles.status}>
											Status:{" "}
											{selectedReport.status ||
												"No Status"}
										</Text>
									</>
								)}
								<TouchableOpacity
									style={styles.button}
									onPress={() => setModalVisible2(false)}
								>
									<Text style={styles.buttonText}>Close</Text>
								</TouchableOpacity>
							</TouchableOpacity>
						</TouchableOpacity>
					</Modal>
					{/* Historical Reports */}
					<View style={styles.container2}>
						<Text
							style={{
								fontSize: 20,
								marginTop: 10,
								marginRight: 95,
								marginBottom: 15,
								color: "#202A44",
								fontWeight: "bold",
							}}
						>
							HISTORICAL REPORTS
						</Text>
						<FlatList
							data={reports}
							keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => openReportDetails(item)}
								>
									<View style={styles.reportItem}>
										<Image
											source={{
												uri: item.image,
												cache: "force-cache",
											}}
											style={styles.imageThumbnail}
										/>
										<View style={styles.textContainer}>
											<Text style={styles.description}>
												{item.description}
											</Text>
											<Text style={styles.timestamp}>
												{item.timestamp
													.toDate()
													.toLocaleString()}
											</Text>
											<Text style={styles.urgency}>
												Urgency: {item.urgency}
											</Text>
											<Text style={styles.category}>
												Report Type: {item.report_type}
											</Text>
											<Text style={styles.accidentReport}>
												Accident Report:{" "}
												{item.accident_report
													? "Yes"
													: "No"}
												{/* Display accident report status */}
											</Text>
										</View>
										<TouchableOpacity
											onPress={() =>
												deleteReport(
													item.id,
													item.image
												)
											}
										>
											<Icon
												name="trash"
												size={24}
												color="#000"
											/>
										</TouchableOpacity>
									</View>
								</TouchableOpacity>
							)}
							nestedScrollEnabled={true}
						/>
					</View>
				</ScrollView>
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
	// container: {
	// flex: 1,
	// backgroundColor: "#F2f9FB",
	// alignContent: "center",
	// alignItems: "center",
	// marginTop: 10,
	// height: "auto",
	// },
	header: {
		position: "absolute",
		left: 0,
		right: 0,
		flexDirection: "row",
		alignContent: "space-between",
		alignItems: "center",
		padding: 20,
		zIndex: 10,
		backgroundColor: "#fff",
		height: 100,
		marginBottom: 5,
		borderBlockEndColor: "#ccc",
	},
	backButton: {
		padding: 10,
		marginRight: 10,
	},
	headerApp: {
		fontSize: 25,
		fontWeight: "bold",
		color: "#202A44",
		marginLeft: 130,
	},
	image: {
		width: 330,
		height: 100,
		marginTop: 20,
		borderRadius: 10,
	},
	placeholderBackground: {
		width: 300,
		height: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		borderColor: "#202A44",
		height: 100,
		width: "90%",
		marginTop: 10,
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
	reportItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
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
		height: 200,
		width: 300,
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
	Heading: {
		color: "#202A44",
		marginTop: 20,
		textAlign: "center",
		fontSize: 35,
		marginBottom: 50,
	},
	Heading2: {
		color: "#202A44",
		marginTop: 40,
		textAlign: "center",
		fontSize: 30,
	},
	button: {
		padding: 12,
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
		width: "80%",
		height: 320,
		borderRadius: 10,
		padding: 20,
		backgroundColor: "#EAF1FF",
		alignItems: "center",
		justifyContent: "center",
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
		fontSize: 20,
		marginTop: 104,
		marginRight: 185,
		color: "#202A44",
		fontWeight: "bold",
	},
	descriptionText: {
		fontSize: 20,
		marginTop: 20,
		marginRight: 185,
		color: "#202A44",
		fontWeight: "bold",
	},
	urgencyLabel: {
		fontSize: 20,
		marginTop: 20,
		marginRight: 75,
		color: "#202A44",
		fontWeight: "bold",
	},
	categoryLabel: {
		fontSize: 20,
		marginTop: 20,
		marginRight: 45,
		color: "#202A44",
		fontWeight: "bold",
	},
	overlay: {
		width: "80%",
		height: 320,
		borderRadius: 10,
		padding: 20,
		backgroundColor: "#EAF1FF",
		alignItems: "center",
		justifyContent: "center",
	},
	overlayContent: {
		alignItems: "center",
	},
	overlayIcon: {
		marginBottom: 15,
	},
	overlayText: {
		fontSize: 16,
		textAlign: "center",
	},
	icontext: {
		textAlign: "justify",
		fontSize: 11,
	},
	status: {
		marginTop: 10,
		fontWeight: "bold",
	},
	urgencyDropdown: {
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	pickerInput: {
		borderColor: "#202A44",
		height: 50,
		width: 330,
		marginTop: 10,
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
	iconContainer: {
		top: 10, // Adjust the position of the arrow icon
		right: 10, // Align to the right
	},
	container2: {
		marginTop: 10,
	},
});
