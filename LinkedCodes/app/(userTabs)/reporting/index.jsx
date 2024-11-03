import {
	View,
	Image,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
	Text,
	StyleSheet,
	TextInput,
	Modal,
	ActivityIndicator,
	ScrollView,
	Dimensions,
	Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import React, { useState, useEffect, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Overlay } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db, storage, auth } from "../../../firebase";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	getStorage,
	uploadBytesResumable,
} from "firebase/storage";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { Link, useRouter } from "expo-router";
import RNPickerSelect from "react-native-picker-select";
import { checkIfOnline } from "../../../services/network";
import useLocation from "../../../src/components/useLocation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Reporting() {
	const { latitude, longitude } = useLocation();

	const [image, setImage] = useState(null);
	const [input, setInput] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [visible, setVisible] = useState(false);
	const [overlayMessage, setOverlayMessage] = useState("");
	const [urgency, setUrgency] = useState("Low");
	const [category, setCategory] = useState("Accident");
	const [loading, setLoading] = useState(false);
	const [showAd, setShowAd] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);

	// Get the current user ID
	const userId = auth.currentUser ? auth.currentUser.uid : null;

	// Toggle overlay for error messages
	const toggleOverlay = () => {
		setVisible(!visible);
	};

	// Sync offline reports to Firebase when the device goes online
	const syncOfflineReports = async () => {
		try {
			const storedReports = await AsyncStorage.getItem("offlineReports");
			if (storedReports) {
				const reportsArray = JSON.parse(storedReports);
				for (const report of reportsArray) {
					const imageUrl = await uploadToFirebase(
						report.image,
						"reportImage"
					);

					const updatedReport = {
						...report,
						image: imageUrl.downloadUrl,
					};
					if (report.id) {
						await setDoc(
							doc(db, "reports", report.id),
							updatedReport
						);
					} else {
						await addDoc(collection(db, "reports"), updatedReport);
					}
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
					accidentReport = true;
				} else if (category === "Road") {
					reportType = "Road";
				} else if (category === "Bridge") {
					reportType = "Bridge";
				}

				const newReport = {
					image, // Save the local image URI for now
					description: input,
					timestamp: new Date(),
					latitude,
					longitude,
					userId,
					urgency,
					report_type: reportType,
					accident_report: accidentReport,
				};

				const isOnline = await checkIfOnline();
				if (isOnline) {
					const imageUrl = await uploadToFirebase(
						image,
						"reportImage"
					);
					newReport.image = imageUrl.downloadUrl;

					// Add the new report to Firestore
					await addDoc(collection(db, "reports"), newReport);
					console.log("Report submitted successfully.");
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
				console.error("Error submitting report: ", error); // Log the error
				setOverlayMessage("Error submitting report: " + error.message);
				setVisible(true);
			} finally {
				setLoading(false); // Always set loading to false after the operation
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
			const subscriptionStatus = await AsyncStorage.getItem(
				`isSubscribed_${userId}`
			);
			if (subscriptionStatus === "true") {
				setIsSubscribed(true);
				setShowAd(false); // Disable ads if subscribed
			} else {
				setShowAd(true);
			}
		};
		if (userId) checkSubscription();
	}, [userId]);

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

	const router = useRouter();

	return (
		<SafeAreaView style={{ flex: 1,
			padding: 0,
			backgroundColor: "#F2f9FB",
			}}>
			
			<ScrollView
				style={{
					flex: 1,
					backgroundColor: "#F2f9FB",
				}}
			>
				<Pressable
					onPress={Keyboard.dismiss}
					accessible={false}
					style={{
						// alignContent: "center",
						alignItems: "center",
						flex: 1,
						backgroundColor: "#F2f9FB",
						// marginTop: 10,
						// height: "auto",
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
									<TouchableOpacity
										onPress={() => uploadImage("camera")}
										style={styles.modalButtonsin}
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
									<TouchableOpacity
										onPress={() => uploadImage("gallery")}
										style={styles.modalButtonsin}
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

									<TouchableOpacity
										onPress={removeImage}
										style={styles.modalButtonsin}
									>
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
								source={{
									uri: image,
									cache: "force-cache",
								}}
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
						style={[
							{
								textAlignVertical: "top",
							},
							styles.input,
						]}
						placeholder="write the description here"
						numberOfLines={2}
					/>
					{/*This is for the add*/}
					<Modal
						visible={showAd && !isSubscribed}
						transparent
					>
						<View
							style={{
								flex: 1,
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "rgba(0, 0, 0, 0.5)",
							}}
						>
							<View
								style={{
									width: 300,
									padding: 20,
									backgroundColor: "white",
									borderRadius: 10,
								}}
							>
								<View style={{ padding: 10 }}>
									<Text
										style={{
											fontSize: 20,
											marginBottom: 10,
											marginTop: 5,
											textAlign: "center",
										}}
									>
										ARE YOU TIRED OF SEEING THIS AD?
										{"\n"}
									</Text>
									<Text
										style={{
											textAlign: "justify",
											fontSize: 15,
											marginBottom: 10,
										}}
									>
										Subscribe to our Premium Package where
										you will have full access to our
										features AD FREE! This ad will continue
										to interrupt your workflow until you do!
										Infrasmart: Take Control or Stay
										Confined!
									</Text>
									<Text
										style={{
											fontSize: 20,
											marginTop: 15,
											textAlign: "center",
										}}
									>
										⏰UPGRADE NOW⏰{"\n"}
										{"\n"}FOR JUSR R99 FOR A YEAR!!!
									</Text>
								</View>
								<Link
									href="/home/premium/"
									asChild
								>
									<TouchableOpacity style={styles.button}>
										<Text style={styles.buttonText}>
											Subscribe to Premuim
										</Text>
									</TouchableOpacity>
								</Link>
								<TouchableOpacity
									onPress={() => setShowAd(false)}
									style={styles.button}
								>
									<Text style={styles.buttonText}>
										Close Ad
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>

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
								chevronContainer: {
									height: "100%",
									justifyContent: "center",
									alignItems: "center",
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
								color="#202A44"
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
					<TouchableOpacity
						style={styles.button}
						onPress={() =>
							router.push({
								pathname: "/(userTabs)/reporting/my_reports",
							})
						}
					>
						<Text style={styles.buttonText}>
							View Historical Reports
						</Text>
					</TouchableOpacity>
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
				</Pressable>
			</ScrollView>
		</SafeAreaView>
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
		// marginTop: 20,
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
		flex: 3,
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
		fontSize: 26,
		color: "#202A44",
		fontWeight: "bold",
		marginBottom: 20,
	},
	textContainer: {
		flex: 1, // Make the text container flexible to allow wrapping
		paddingLeft: 20,
		paddingRight: 10,
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
		flexDirection: "row",
		justifyContent: "space-evenly",
		width: "100%",
	},
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
		backgroundColor: "#fff", // Semi-transparent background
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
		marginTop: 20,
		// marginRight: 185,
		textAlign: "left",
		color: "#202A44",
		fontWeight: "bold",
	},
	descriptionText: {
		fontSize: 20,
		marginTop: 20,
		// marginRight: 185,
		textAlign: "left",
		color: "#202A44",
		fontWeight: "bold",
		textAlignVertical: "top",
	},
	urgencyLabel: {
		fontSize: 20,
		marginTop: 20,
		// marginRight: 75,
		textAlign: "left",
		color: "#202A44",
		fontWeight: "bold",
	},
	categoryLabel: {
		fontSize: 20,
		marginTop: 20,
		// marginRight: 45,
		textAlign: "left",
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
		width: Dimensions.get("window").width - 40,
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
		justifyContent: "center",
		alignItems: "center",
		width: "10%",
		height: "100%",
	},
});

const uploadToFirebase = async (uri, name, onProgress) => {
	const fetchResponse = await fetch(uri);
	const theBlob = await fetchResponse.blob();
	const imageRef = ref(getStorage(), `profiles/${name}`);
	const uploadTask = uploadBytesResumable(imageRef, theBlob);

	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onProgress && onProgress(progress);
			},
			(error) => {
				// Handle unsuccessful uploads
				console.log("Upload ERROR", error);
				reject(error);
			},
			async () => {
				const downloadUrl = await getDownloadURL(
					uploadTask.snapshot.ref
				);
				resolve({
					downloadUrl,
					metadata: uploadTask.snapshot.metadata,
				});
			}
		);
	});
};
