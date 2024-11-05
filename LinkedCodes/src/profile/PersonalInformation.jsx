import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	Alert,
	StyleSheet,
	Image,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { db, storage } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Stack, useRouter } from "expo-router"; // Import Stack and useRouter from expo-router

const PersonalInformation = ({ route }) => {
	const router = useRouter(); // Create router instance
	const { initialProfileImage } = route.params; // Get the initial profile image from route params

	const [formValues, setFormValues] = useState({
		username: "",
		email: "",
		mobile: "",
	});
	const [profileImage, setProfileImageState] = useState(initialProfileImage); // Use the initial value
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const userId = auth.currentUser.uid;
			const userDocRef = doc(db, "user", userId);
			const docSnap = await getDoc(userDocRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setFormValues({
					username: data.username || "",
					email: data.email || "",
					mobile: data.mobile || "",
				});
				if (data.profileImage) {
					setProfileImageState(data.profileImage);
				}
			} else {
				console.log("No such document!");
			}
		};

		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				fetchData();
			} else {
				Alert.alert("User is not authenticated");
				router.back(); // Use router.back() instead of navigation.goBack()
			}
		});

		return () => unsubscribe();
	}, [router]);

	const handleChange = (name, value) => {
		setFormValues((prevValues) => ({
			...prevValues,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		const userId = auth.currentUser.uid;
		const userDocRef = doc(db, "user", userId);
		setLoading(true);

		try {
			if (profileImage) {
				const response = await fetch(profileImage);
				const blob = await response.blob();
				const storageRef = ref(storage, `profileImages/${userId}`);
				await uploadBytes(storageRef, blob);
				const imageUrl = await getDownloadURL(storageRef);
				formValues.profileImage = imageUrl; // Add image URL to formValues
			}

			await setDoc(userDocRef, { ...formValues }, { merge: true });
			Alert.alert("Profile updated successfully!");
			router.push("/UserProfile"); // Use router.push to navigate
		} catch (error) {
			console.error("Firestore update error:", error);
			Alert.alert("Failed to update profile. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const pickImage = async () => {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
			Alert.alert("Permission to access camera roll is required!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setProfileImageState(result.assets[0].uri);
		}
	};

	const textColor = isDarkMode ? "#FFFFFF" : "#000000";
	const placeholderColor = isDarkMode ? "#CCCCCC" : "#AAAAAA";
	const backgroundColor = isDarkMode ? "#000000" : "#EAF1FF";
	const borderColor = isDarkMode ? "#333333" : "#003366"; // Border color for lines and profile picture

	return (
		<ScrollView
			contentContainerStyle={[styles.container, { backgroundColor }]}
		>
			<View style={styles.profileContainer}>
				{profileImage ? (
					<Image
						source={{ uri: profileImage, cache: "force-cache" }}
						style={styles.profilePicture}
					/>
				) : (
					<View style={styles.profilePlaceholder}>
						<Text
							style={[
								styles.profilePictureText,
								{ color: textColor },
							]}
						>
							No Profile Picture
						</Text>
					</View>
				)}
				<TouchableOpacity
					style={styles.changePictureButton}
					onPress={pickImage}
				>
					<Text style={styles.changePictureButtonText}>
						Change Picture
					</Text>
				</TouchableOpacity>
			</View>

			{["username", "email", "mobile"].map((field) => (
				<View
					key={field}
					style={styles.inputContainer}
				>
					<Text style={[styles.label, { color: textColor }]}>
						{field.charAt(0).toUpperCase() + field.slice(1)}
					</Text>
					<TextInput
						onChangeText={(value) => handleChange(field, value)}
						value={formValues[field]}
						style={[styles.input, { color: textColor }]}
						placeholderTextColor={placeholderColor}
					/>
					<View
						style={[styles.line, { backgroundColor: borderColor }]}
					/>
				</View>
			))}

			{loading ? (
				<ActivityIndicator
					size="large"
					color="#202A44"
				/>
			) : (
				<TouchableOpacity
					style={styles.submitButton}
					onPress={handleSubmit}
				>
					<Text style={styles.submitButtonText}>Submit</Text>
				</TouchableOpacity>
			)}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	profileContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	profilePicture: {
		width: 120,
		height: 120,
		borderRadius: 60,
		backgroundColor: "#e9ecef",
		borderWidth: 3,
		borderColor: "#333", // Use the dynamic border color
		marginBottom: 10,
	},
	profilePlaceholder: {
		width: 120,
		height: 120,
		backgroundColor: "#e9ecef",
		borderWidth: 3,
		borderColor: "#333", // Use the dynamic border color
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	profilePictureText: {
		textAlign: "center",
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
	inputContainer: {
		width: "100%",
		marginBottom: 10,
	},
	input: {
		width: "100%",
		paddingVertical: 8,
		marginBottom: 5,
		borderWidth: 0,
		paddingHorizontal: 10,
	},
	line: {
		height: 1,
		width: "100%",
		marginTop: 5,
	},
	changePictureButton: {
		backgroundColor: "#202A44",
		padding: 10,
		borderRadius: 5,
		marginTop: 10,
	},
	changePictureButtonText: {
		color: "#FFFFFF",
		textAlign: "center",
	},
	submitButton: {
		backgroundColor: "#202A44",
		padding: 10,
		borderRadius: 5,
		width: "100%",
		alignItems: "center",
	},
	submitButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
	},
});

export default PersonalInformation;
