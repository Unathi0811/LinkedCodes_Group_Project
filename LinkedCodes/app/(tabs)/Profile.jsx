import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import { Button, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getApp, getApps } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useUser } from "../../src/cxt/user";
import { db } from "../../firebase";

const Profile = () => {
  const [image, setImage] = useState(null);
 const {setUser,user} = useUser()

 console.log(user)
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
        const uploadResp = await uploadToFirebase(result.assets[0].uri, fileName, (v) =>
          console.log(v) // use this to show progress
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
    <View>
      <Text>Profile</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});

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


const saveProfileImage = async (userId, downloadUrl) => {
  const userDoc = doc(db, "user", userId);
  await updateDoc(userDoc, {
    profileImage: downloadUrl,
  });
}