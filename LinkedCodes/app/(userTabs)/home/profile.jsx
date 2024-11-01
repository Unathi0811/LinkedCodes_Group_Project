<<<<<<< HEAD
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
=======
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
>>>>>>> origin/master
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
<<<<<<< HEAD
=======
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { Link } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
>>>>>>> origin/master
import { useUser } from "../../../src/cxt/user";
import { db, auth } from "../../../firebase";
import { signOut, deleteUser } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useTheme } from "../../../src/cxt/theme"; // Import the useTheme hook

const Profile = () => {
<<<<<<< HEAD
  const { setUser, user } = useUser();
  const { theme } = useTheme(); // Get the current theme
  const [image, setImage] = useState(user.profileImage);

  useEffect(() => {
    if (user) setImage(user.profileImage);
  }, [user]);
=======
	const { setUser, user } = useUser();
	const [image, setImage] = useState(user.profileImage);

	useEffect(() => {
		if (user) {
			setImage(user.profileImage);
		}
	}, [user]);
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
        const uploadResp = await uploadToFirebase(result.assets[0].uri, fileName);
        await saveProfileImage(user.uid, uploadResp.downloadUrl);
        setUser({ ...user, profileImage: uploadResp.downloadUrl });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        await deleteUser(currentUser); // Delete from Firebase Auth
        const userDoc = doc(db, "users", currentUser.uid); // Delete from Firestore
        await deleteDoc(userDoc);
        await signOut(auth); // Log out after deletion
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

        <View style={styles.profileContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>No Profile Picture</Text>
            </View>
          )}
          <Text style={[styles.name, { color: theme.text }]}>{user.username || 'Name'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.separator} />
          <Link href="/(userTabs)/home/edit-profile" asChild>
            <Pressable style={styles.button}>
              <Icon name="person" size={35} color={theme.text} />
              <Text style={[styles.buttonText, { color: theme.text }]}>Personal Information</Text>
            </Pressable>
          </Link>

          {user?.admin && (
            <>
              <View style={styles.separator} />
              <Link href="/(userTabs)/home/admin" asChild>
                <Pressable style={styles.button}>
                  <Icon name="admin-panel-settings" size={32} color={theme.text} />
                  <Text style={[styles.buttonText, { color: theme.text }]}>Admin</Text>
                </Pressable>
              </Link>
            </>
          )}

          <View style={styles.separator} />
          <TouchableOpacity style={styles.button} onPress={confirmDeleteAccount}>
            <Icon name="delete" size={32} color={theme.text} />
            <Text style={[styles.buttonText, { color: theme.text }]}>Delete Account</Text>
          </TouchableOpacity>

          <View style={styles.separator} />
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Alert.alert("Logout", "Are you sure you want to logout?", [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => signOut(auth), style: "destructive" },
              ])
            }
          >
            <Icon name="logout" size={30} color={theme.text} />
            <Text style={[styles.buttonText, { color: theme.text }]}>Log Out</Text>
          </TouchableOpacity>

          <View style={styles.separator} />
        </View>
      </ScrollView>
    </View>
  );
=======
			if (!result.canceled) {
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
		}
	};

	return (
		<View style={styles.container}>
			{/* Fixed header with profile details */}
			<View style={styles.headerContainer}>
				<View style={styles.header}>
					<Pressable onPress={pickImage}>
						<Image
							source={{
								uri:
									user.profileImage ??
									"https://via.placeholder.com/150",
								cache: "force-cache",
							}}
							style={styles.image}
						/>
					</Pressable>
					<Text style={styles.username}>
						{user.username ?? "Unknown Name"}
					</Text>
				</View>
			</View>

			{/* Links and buttons */}
			<ScrollView style={styles.content}>
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
							href="/(userTabs)/Profile/admin"
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
					<Pressable
						style={styles.card}
						onPress={() => {
							Alert.alert(
								"Logout",
								"Are you sure you want to logout?",
								[
									{
										text: "Cancel",
										onPress: () =>
											console.log("Logout canceled"),
										style: "cancel",
									},
									{
										text: "Logout",
										onPress: () => signOut(auth),
										style: "destructive",
									},
								],
								{ cancelable: true }
							);
						}}
					>
						<Text style={styles.cardText}>Logout</Text>
						<Icon
							name="sign-out"
							size={25}
							color="#fff"
							style={styles.icon}
						/>
					</Pressable>
				</View>
			</ScrollView>
		</View>
	);
>>>>>>> origin/master
};

export default Profile;

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  profilePlaceholderText: {
    color: '#000',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
  },
  separator: {
    height: 3,
    backgroundColor: '#003366',
    marginVertical: 5,
  },
});
=======
	container: {
		flex: 1,
		backgroundColor: "#F2f9FB",
	},
	headerContainer: {
		position: "absolute",
		top: -25,
		left: 0,
		right: 0,
		marginBottom: 20,
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
		marginTop: 20,
	},
	username: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 20,
	},
	email: {
		fontSize: 12,
		color: "#fff",
	},
	content: {
		marginTop: 280,
		paddingHorizontal: 30,
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
>>>>>>> origin/master
