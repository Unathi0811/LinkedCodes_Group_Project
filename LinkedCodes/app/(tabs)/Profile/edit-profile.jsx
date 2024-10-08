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

  // const handleDeleteRequest = async () => {
  //   try {
  //     // Create a new deletion request document
  //     const deleteRequestDoc = {
  //       userId: user.uid,
  //       email: user.email,
  //       department: user.department,
  //       timestamp: new Date(),
  //       status: "pending",
  //     };

  //     // Save the deletion request in the 'delete_requests' collection
  //     const requestRef = await addDoc(collection(db, "delete_requests"), deleteRequestDoc);

  //     // Add a notification related to this deletion request
  //     const notificationDoc = {
  //       message: `${user.email} has requested account deletion.`,
  //       timestamp: new Date(),
  //       isRead: false, // Flag for unread notification
  //     };

  //     // Add notification as a subcollection to the deletion request
  //     await addDoc(collection(db, `delete_requests/${requestRef.id}/notifications`), notificationDoc);

  //     console.log("Account deletion request submitted successfully");
  //     alert("Your account deletion request has been submitted.");
  //   } catch (error) {
  //     console.error("Error submitting deletion request:", error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={{
            uri: user.profileImage ?? "https://via.placeholder.com/150",
          }}
        />
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Icon name="camera" size={24} color="#202A44" />
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
            // onPress={handleDeleteRequest}
          >
            <Text style={styles.deleteButtonText}>
              Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
        onProgress && onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadUrl });
      }
    );
  });
};

const saveProfileImage = async (userId, downloadUrl) => {
  const userDoc = doc(db, "user", userId);
  await updateDoc(userDoc, { profileImage: downloadUrl });
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
    fontSize: 18,
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
    shadowColor: "#000",
    marginTop: 0,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default EditProfile;
