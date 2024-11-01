import React, { useEffect, useState } from "react";
import {
<<<<<<< HEAD
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
=======
	View,
	Text,
	TextInput,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
>>>>>>> origin/master
} from "react-native";
import { useUser } from "../../../src/cxt/user";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
<<<<<<< HEAD
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteUser, signOut, updatePassword } from "firebase/auth";
import { useTheme } from "../../../src/cxt/theme"; // Adjust path as necessary

const EditProfile = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUser();
  const { theme } = useTheme(); // Use the theme context
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");
  const [image, setImage] = useState(user.profileImage);
  const [newPassword, setNewPassword] = useState(""); // New password state
  const [isLoading, setIsLoading] = useState(false);
  
  // Set navigation options with setProfileImage function
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={pickImage}>
          <Icon name="camera" size={24} color={theme.text} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme.text]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const userDoc = doc(db, "user", user.uid);
      await updateDoc(userDoc, {
        username,
        email,
        mobile,
      });

      setUser({
        ...user,
        username,
        email,
        mobile,
      });

      // If a new password is provided, update it
      if (newPassword) {
        await updatePassword(auth.currentUser, newPassword);
        Alert.alert("Success", "Password updated successfully.");
      }

      console.log("Profile updated successfully");
      navigation.navigate("profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Unable to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
=======
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteUser } from "firebase/auth";

const EditProfile = () => {
	const { user, setUser } = useUser();
	const [username, setUsername] = useState(user?.username || "");
	const [email, setEmail] = useState(user?.email || "");
	const [mobile, setMobile] = useState(user?.mobile || "");
	const [image, setImage] = useState(user.profileImage);
	const [password, setPassword] = useState("");

	const handleSave = async () => {
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
		} catch (error) {
			console.error("Error updating profile:", error);
		}
	};
>>>>>>> origin/master

	const pickImage = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 4],
				quality: 0.8,
			});

<<<<<<< HEAD
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        const fileName = result.assets[0].uri.split("/").pop();
        const uploadResp = await uploadToFirebase(
          result.assets[0].uri,
          fileName,
          (progress) => console.log(progress)
        );
        await saveProfileImage(user.uid, uploadResp.downloadUrl);
        setUser({ ...user, profileImage: uploadResp.downloadUrl });
      }
    } catch (e) {
      console.log(e);
    }
  };
=======
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
>>>>>>> origin/master

	const handleDeleteAccount = async () => {
		try {
			const currentUser = auth.currentUser;

<<<<<<< HEAD
      if (currentUser) {
        await deleteUser(currentUser);
        const userDoc = doc(db, "users", currentUser.uid);
        await deleteDoc(userDoc);
        await signOut(auth);
        console.log("User account deleted and logged out");
        Alert.alert("Your account has been deleted.");
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
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: handleDeleteAccount, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: image ?? "https://via.placeholder.com/150" }}
        />
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="Enter new password"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.text }]}>Mobile</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.text} />
          ) : (
            <TouchableOpacity style={styles.deleteButton} onPress={handleSave}>
              <Text style={styles.deleteButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
=======
			if (currentUser) {
				// Delete user from Firebase Auth
				await deleteUser(currentUser);

				// Remove user data from Firestore
				const userDoc = doc(db, "users", currentUser.uid);
				await deleteDoc(userDoc);

				// Sign out the user after deletion
				await signOut(auth);
				console.log("User account deleted and logged out");
				alert("Your account has been deleted.");
				// You can navigate to a login screen or homepage here
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

					<TouchableOpacity
						style={styles.button}
						onPress={confirmDeleteAccount}
					>
						<Text style={styles.buttonText}>Delete Account</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
>>>>>>> origin/master
};

// Firebase-related functions
const uploadToFirebase = async (uri, name, onProgress) => {
	const fetchResponse = await fetch(uri);
	const blob = await fetchResponse.blob();
	const imageRef = ref(getStorage(), `profiles/${name}`);
	const uploadTask = uploadBytesResumable(imageRef, blob);

<<<<<<< HEAD
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress && onProgress(progress);
      },
      reject,
      async () => resolve({ downloadUrl: await getDownloadURL(uploadTask.snapshot.ref) })
    );
  });
=======
	return new Promise((resolve, reject) => {
		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				onProgress && onProgress(progress);
			},
			(error) => reject(error),
			async () => {
				const downloadUrl = await getDownloadURL(
					uploadTask.snapshot.ref
				);
				resolve({ downloadUrl });
			}
		);
	});
>>>>>>> origin/master
};

const saveProfileImage = async (userId, downloadUrl) => {
	const userDoc = doc(db, "user", userId);
	await updateDoc(userDoc, { profileImage: downloadUrl });
};

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
    padding: 20,
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
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#202A44",
    borderWidth: 2,
    marginTop: 30,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
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
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: "#202A44",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#202A44",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
=======
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
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderColor: "#202A44",
		borderWidth: 2,
		marginTop: 30,
		marginBottom: 10,
	},
	cameraIcon: {
		position: "absolute",
		bottom: 40,
		right: 170,
		padding: 5,
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
		color: "#202A44",
		fontWeight: "bold",
		marginLeft: 64,
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
>>>>>>> origin/master
});

export default EditProfile;
