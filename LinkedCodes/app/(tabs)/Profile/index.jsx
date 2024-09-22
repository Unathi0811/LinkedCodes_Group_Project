import {
  ScrollView,
  ScrollViewBase,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Button, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getApp, getApps } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { Link } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "../../../src/cxt/user";
import { db, auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";

const Profile = () => {
  const { setUser, user } = useUser();
  const [image, setImage] = useState(user.profileImage);

  const handleMenuPress = () => {
    console.log("Hamburger menu pressed");
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
          (v) => console.log(v) // use this to show progress
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
      {/* Fixed header with hamburger button */}
      <View style={styles.headerContainer}>
        {/* <TouchableOpacity
          onPress={handleMenuPress}
          style={styles.hamburgerButton}
        >
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity> */}
        <View
        style={styles.header}
        >
          <Pressable onPress={pickImage}>
            <Image source={{ uri: user.profileImage }} style={styles.image} />
          </Pressable>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#202A44",
            }}
          >
            Welcome {user.username ?? "Unkown Name"} !
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        
      <View style={styles.linksContainer}>
          {/* create the edit profile screen */}
          <Link href="/(tabs)/Profile/edit-profile" asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardText}>Personal Information</Text>
            </Pressable>
          </Link>

          <Link href="/(tabs)/Profile/admin" asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardText}>Admin</Text>
            </Pressable>
          </Link>

          <Link asChild href={"/(tabs)/Profile/edit-profile"}>
            <Pressable style={styles.card}>
              <Text style={styles.cardText}>Delete Account</Text>
            </Pressable>
          </Link>

          <Pressable style={styles.card} onPress={() => signOut(auth)}>
            <Text style={styles.cardText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

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
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
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

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "#fff",
  },
  content: {
    marginTop: 200, 
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: "row",
    gap: 20,
  },
  headerContainer: {
    position: "absolute",
    top: 23,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 50,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#fff",
  },
  hamburgerButton: {
    padding: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  linksContainer: {
    width: "100%",
    gap: 15,
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    color: "#202A44",
    fontSize: 16,
  },
});
