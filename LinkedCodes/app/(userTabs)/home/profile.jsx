import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Modal,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { Link, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "../../../src/cxt/user";
import { db, auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";

const Profile = () => {
	const { setUser, user } = useUser();
	const [image, setImage] = useState(user.profileImage);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		if (user) {
			setImage(user.profileImage);
		}
	}, [user]);
	const router = useRouter();
	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 4],
				quality: 0.8,
			});

			if (!result.canceled) {
				setLoading(true);
				setImage(result.assets[0].uri);
				const fileName = result.assets[0].uri.split("/").pop();
				const uploadResp = await uploadToFirebase(
					result.assets[0].uri,
					fileName,
					(v) => console.log(v) //to show progress
				);
				await saveProfileImage(user.uid, uploadResp.downloadUrl);
				setUser({
					...user,
					profileImage: uploadResp.downloadUrl,
				});
			}
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false); // Set loading to false after upload completes
		}
	};

	const handleLogout = () => {
		signOut(auth);
		setModalVisible(false);
	};

	return (
		<View style={styles.container}>
			{/* Fixed header with profile details */}
			<View style={styles.headerContainer}>
				<TouchableOpacity
					onPress={() => router.push("/(userTabs)/home")}
					style={styles.backButton}
				>
					<Icon
						name="arrow-left"
						size={20}
						color="#fff"
					/>
				</TouchableOpacity>
				<View style={styles.header}>
					<Pressable onPress={pickImage}>
						{loading ? ( // Show ActivityIndicator if loading
							<ActivityIndicator
								size="small"
								color="#fff"
							/>
						) : (
							<Image
								source={{
									uri:
										image ??
										"https://via.placeholder.com/150",
									cache: "force-cache",
								}}
								style={styles.image}
							/>
						)}
					</Pressable>
					<Text style={styles.username}>
						{user.username ?? "Unknown Name"}
					</Text>
				</View>
			</View>

			{/* Links and buttons */}
			<View style={styles.content}>
				<View style={styles.linksContainer}>
					{/* Personal Information link */}
					<Link
						href="/(userTabs)/home/edit-profile"
						asChild
					>
						<Pressable style={styles.card}>
							<Text style={styles.cardText}>
								Personal Information
							</Text>
							<Icon
								name="chevron-right"
								size={20}
								color="#fff"
								style={styles.icon}
							/>
						</Pressable>
					</Link>

					{/* Admin link (only if the user is an admin) */}
					{user?.admin && (
						<Link
							href="/(tabs)/Profile/admin"
							asChild
						>
							<Pressable style={styles.card}>
								<Text style={styles.cardText}>Admin</Text>
								<Icon
									name="chevron-right"
									size={20}
									color="#fff"
									style={styles.icon}
								/>
							</Pressable>
						</Link>
					)}

					{/* Logout button */}
					<TouchableOpacity
						style={styles.card}
						onPress={() => setModalVisible(true)}
					>
						<Text style={styles.cardText}>Logout</Text>
						<Icon
							name="sign-out"
							size={20}
							color="#fff"
							style={styles.icon}
						/>
					</TouchableOpacity>

					<Modal
						transparent={true}
						animationType="slide"
						visible={modalVisible}
						onRequestClose={() => setModalVisible(false)}
					>
						<View style={styles.modalOverlay}>
							<View style={styles.modalContent}>
								<Icon
									name="sign-out"
									size={40}
									color="#202A44"
									style={styles.logoutIcon}
								/>
								<Text style={styles.modalMessage}>
									Are you sure you want to logout?
								</Text>
								<View style={styles.modalButtons}>
									<TouchableOpacity
										style={styles.cancelButton}
										onPress={() => setModalVisible(false)}
									>
										<Text style={styles.cancelText}>
											Cancel
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.logoutButton}
										onPress={handleLogout}
									>
										<Text style={styles.buttonText}>
											Logout
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</Modal>
				</View>
			</View>
		</View>
	);
};

export default Profile;

// Styles for the layout
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#202A44",
	},
	headerContainer: {
		paddingHorizontal: 20,
		paddingVertical: 50,
		backgroundColor: "#202A44",
		zIndex: 1,
	},
	header: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 50,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 20,
		marginTop: 30,
	},
	username: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: -10,
	},
	email: {
		fontSize: 12,
		color: "#fff",
	},
	content: {
		// marginTop: 280,
		paddingHorizontal: 30,
		backgroundColor: "#F2f9FB",
		flex: 1,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
	},
	linksContainer: {
		width: "100%",
		gap: 15,
		marginTop: 30,
	},
	card: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#202A44",
		padding: 15,
		borderRadius: 10,
		shadowColor: "#202A44",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 5,
	},
	cardText: {
		color: "#fff",
		fontSize: 16,
	},
	icon: {
		marginLeft: 10,
	},
	backButton: {
		padding: 10,
		marginRight: 10,
		color: "#fff",
	},

	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: 300,
		padding: 20,
		backgroundColor: "#F2f9FB",
		borderRadius: 10,
		alignItems: "center",
		height: 350,
		justifyContent: "center",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	modalMessage: {
		marginVertical: 10,
		textAlign: "center",
		marginBottom: 40,
		fontSize: 20,
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	cancelButton: {
		flex: 1,
		padding: 10,
		alignItems: "center",
		backgroundColor: "#ddd",
		borderRadius: 5,
		marginRight: 5,
	},
	logoutButton: {
		flex: 1,
		padding: 10,
		alignItems: "center",
		backgroundColor: "#202A44",
		borderRadius: 5,
		marginLeft: 5,
	},
	buttonText: {
		color: "#F2f9FB",
		fontWeight: "bold",
	},
	cancelText: {
		color: "#202A44",
		fontWeight: "bold",
	},
	logoutIcon: {
		marginBottom: 40,
	},
});

//The following code does the following:
// uploadToFirebase is a function that uploads an image to Firebase Storage
// it takes three arguments: the image URI, the file name, and a callback function
// the callback function is called with the upload progress (in bytes)
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

//explaination of the code
//The following code is a function that handles the upload of an image to Firebase Storage
//It takes three arguments: the image URI, the file name, and a callback function
//The callback function is called with the upload progress (in bytes)
const saveProfileImage = async (userId, downloadUrl) => {
	const userDoc = doc(db, "user", userId);
	await updateDoc(userDoc, {
		profileImage: downloadUrl,
	});
};
