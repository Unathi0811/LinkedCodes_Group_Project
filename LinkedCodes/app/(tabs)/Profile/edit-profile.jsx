import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Pressable,
	Alert,
	Modal,
	ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import { useUser } from "../../../src/cxt/user";
import { auth, db } from "../../../firebase";
import {
	doc,
	updateDoc,
	deleteDoc,
	addDoc,
	collection,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	deleteUser,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";
import { useRouter } from "expo-router";

const EditProfile = () => {
	const { user, setUser } = useUser();
	const [username, setUsername] = useState(user?.username || "");
	const [email, setEmail] = useState(user?.email || "");
	const [mobile, setMobile] = useState(user?.mobile || "");
	const [image, setImage] = useState(user.profileImage);
	const [password, setPassword] = useState("");
	const [overlayMessage, setOverlayMessage] = useState("");
	const [loading, setLoading] = useState(false); // State for loading
	const [visible, setVisible] = useState(false); // State for overlay visibility
	const router = useRouter();

	const handleSave = async () => {
		setLoading(true); // Start loading
		try {
			const userDoc = doc(db, "user", user.uid); // Update user doc in Firestore

			await updateDoc(userDoc, {
				username,
				email,
				mobile,
			});

			// update the user context
			setUser({
				...user,
				username,
				email,
				mobile,
			});

			console.log("Profile updated successfully");
			setOverlayMessage("You have successfully updated your profile!"); // Set overlay message
			setVisible(true); // Show overlay
		} catch (error) {
			console.error("Error updating profile:", error);
		} finally {
			setLoading(false); // Stop loading
		}
	};

	// Toggle overlay for error messages
	const toggleOverlay = () => {
		setVisible(!visible);
	};

	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 4],
				quality: 0.8,
			});

			if (!result.canceled) {
				setImage(result.assets[0].uri);
				const fileName = result.assets[0].uri.split("/").pop();
				const uploadResp = await uploadToFirebase(
					result.assets[0].uri,
					fileName,
					(progress) => {
						console.log(progress); // Show upload progress
					}
				);
				await saveProfileImage(user.uid, uploadResp.downloadUrl);
				setUser({
					...user,
					profileImage: uploadResp.downloadUrl,
				});
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			const currentUser = auth.currentUser;
			if (currentUser) {
				// Delete user from Firebase Auth
				await deleteUser(currentUser);

				// Remove user data from Firestore
				const userDoc = doc(db, "user", currentUser.uid); // Updated to match your Firestore collection
				await deleteDoc(userDoc);

				// Sign out the user after deletion
				await auth.signOut(); // Ensure you're using the correct method to sign out
				console.log("User account deleted and logged out");
				Alert.alert("Your account has been deleted.");
				// Navigate to login screen or homepage here
				router.replace("/(auth)/login"); // Adjust the route as necessary
			}
		} catch (error) {
			console.error("Error deleting account:", error);
			Alert.alert("Error", "Unable to delete account. Please try again.");
		}
	};

	const confirmDeleteAccount = () => {
		Alert.alert(
			"Delete Account",
			"Are you sure you want to delete your account? This action is irreversible.",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Account deletion canceled"),
					style: "cancel",
				},
				{
					text: "Delete",
					onPress: handleDeleteAccount,
					style: "destructive",
				},
			],
			{ cancelable: true }
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.profileImageContainer}>
				{/* Back Button */}
				<Pressable
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Icon
						name="arrow-left"
						size={20}
						color="#fff"
					/>
				</Pressable>

				<View
					style={{
						width: 100,
						height: 100,
						borderRadius: 50,
						borderColor: "#202A44",
						borderWidth: 2,
						marginTop: 30,
						marginBottom: 10,
						position: "relative",
						zIndex: 1,
						marginTop: 10,
					}}
				>
					<Image
						style={styles.profileImage}
						source={{
							uri:
								user.profileImage ??
								"https://via.placeholder.com/150",
							cache: "force-cache",
						}}
					/>
					<TouchableOpacity
						style={styles.cameraIcon}
						onPress={pickImage}
					>
						<Icon
							name="camera"
							size={24}
							color="#202A44"
						/>
					</TouchableOpacity>
				</View>
			</View>
			<ScrollView style={styles.scrollContainer}>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Username</Text>
					<TextInput
						style={styles.input}
						value={username}
						onChangeText={setUsername}
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Email</Text>
					<TextInput
						style={styles.input}
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Password</Text>
					<TextInput
						style={styles.input}
						value={password}
						onChangeText={setPassword}
						secureTextEntry={true}
						placeholder="**********"
					/>
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Mobile</Text>
					<TextInput
						style={styles.input}
						value={mobile}
						onChangeText={setMobile}
						keyboardType="numeric"
					/>
				</View>

				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.deleteButton}
						onPress={handleSave}
					>
						<Text style={styles.deleteButtonText}>
							Save Changes
						</Text>
					</TouchableOpacity>

					{/* Uncomment this section to enable delete account functionality */}
					{/* <TouchableOpacity
						style={{
							alignItems: "center",
							justifyContent: "center",
							borderColor: "red",
							borderWidth: 1,
							borderRadius: 12,
							paddingVertical: 12,
						}}
						onPress={confirmDeleteAccount}
					>
						<Text style={styles.buttonText}>Delete Account</Text>
					</TouchableOpacity> */}
				</View>
			</ScrollView>

			{/* Activity Indicator and Overlay Message */}
			<Modal
				transparent={true}
				visible={visible}
				animationType="slide"
			>
				<View style={styles.overlay}>
					<ActivityIndicator size="large" color="#202A44" />
					<Text style={styles.overlayText}>{overlayMessage}</Text>
					<Button
						title="Close"
						onPress={() => setVisible(false)}
					/>
				</View>
			</Modal>
		</View>
	);
};

// Additional Firebase-related functions (unchanged)
const uploadToFirebase = async (uri, name, onProgress) => {
	const fetchResponse = await fetch(uri);
	const blob = await fetchResponse.blob();
	const imageRef = ref(getStorage(), `profiles/${name}`);
	const uploadTask = uploadBytesResumable(imageRef, blob);

	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onProgress(progress);
			},
			(error) => {
				console.error("Upload failed:", error);
				reject(error);
			},
			async () => {
				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
				resolve({ downloadUrl: downloadURL });
			}
		);
	});
};

const saveProfileImage = async (uid, imageUrl) => {
	const userDoc = doc(db, "user", uid);
	await updateDoc(userDoc, {
		profileImage: imageUrl,
	});
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
		color: "#202A44",
	},
	scrollContainer: {
		marginTop: 160,
	},
	profileImageContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		paddingTop: 40,
		paddingHorizontal: 20,
		backgroundColor: "#202A44",
		zIndex: 10,
		paddingBottom: 30,
		height: 150,
	},
	backButton: {
		position: "absolute",
		left: 20,
		top: 70,
		padding: 10,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
	},
	cameraIcon: {
		position: "absolute",
		// padding: 5,
		top: 37,
		left: 37,
	},
	inputContainer: {
		marginBottom: 18,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: "#202A44",
		marginLeft: 20,
	},
	input: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 12,
		paddingHorizontal: 20,
		marginHorizontal: 20,
		elevation: 5,
		height: 50,
		fontSize: 16,
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		shadowColor: "#202A44",
	},
	buttonContainer: {
		marginTop: 20,
		marginHorizontal: 20,
		gap: 20,
	},
	buttonText: {
		color: "red",
		fontWeight: "bold",
		// marginLeft: 64,
		fontSize: 15,
	},
	deleteButton: {
		backgroundColor: "#202A44",
		borderRadius: 12,
		paddingVertical: 12,
		marginHorizontal: 20,
		width: "100%",
		marginLeft: 0,
		elevation: 5,
		alignItems: "center",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		shadowColor: "#202A44",
		marginTop: 0,
	},
	deleteButtonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
	},
	overlay: {
		flex: 1, // Use flex to cover the whole screen
		justifyContent: "center", // Center the overlay vertically
		alignItems: "center", // Center the overlay horizontally
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
	overlayContent: {
		width: "80%", // Set width of overlay content
		padding: 20,
		backgroundColor: "#EAF1FF", // Background color of the content
		borderRadius: 10,
		shadowColor: "#202A44", // Shadow color
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5, // For Android shadow effect
		alignItems: "center", // Center items inside the content
	},
	overlayText: {
		fontSize: 16,
		textAlign: "center", // Center text inside overlay
		marginBottom: 20, // Space between text and button
	},
});


export default EditProfile;
