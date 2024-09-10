import { StyleSheet, Text, View } from "react-native";
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

const Profile = () => {
  const { setUser, user } = useUser();
  const [image, setImage] = useState(user.profileImage);

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
    <View
      style={{
        flex: 1,
        padding: 20,
        alignItems: "center",
        gap: 30,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Pressable onPress={pickImage}>
          <Image source={{ uri: user.profileImage }} style={styles.image} />
        </Pressable>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {user.username ?? "Unkown Name"}
        </Text>
      </View>

      <View
        style={{
          // alignItems: "center",
          width: "90%",
          gap: 10,
        }}
      >
        <Link href="/edit-profile">
          <Pressable
            style={{
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "blue",
                fontSize: 16,
              }}
            >
              Personal Information
            </Text>
          </Pressable>
        </Link>

        <Link href="/(tabs)/Profile/admin" asChild>
          <Pressable
            style={{
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "blue",
                fontSize: 16,
              }}
            >
              Admin
            </Text>
          </Pressable>
        </Link>

        <Pressable
          style={{
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text
            style={{
              color: "blue",
              fontSize: 16,
            }}
          >
            Delete Account
          </Text>
        </Pressable>
        <Pressable
          style={{
            padding: 10,
            borderRadius: 10,
          }}
          onPress={() => signOut(auth)}
        >
          <Text
            style={{
              color: "blue",
              fontSize: 16,
            }}
          >
            Logout
          </Text>
        </Pressable>
      </View>
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
