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
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "../../../src/cxt/user";
import { db, auth } from "../../../firebase";
import { signOut, deleteUser } from "firebase/auth";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useTheme } from "../../../src/cxt/theme"; // Import the useTheme hook

const Profile = () => {
  const { setUser, user } = useUser();
  const { theme } = useTheme(); // Get the current theme
  const [image, setImage] = useState(user.profileImage);

  useEffect(() => {
    if (user) setImage(user.profileImage);
  }, [user]);

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
};

export default Profile;

const styles = StyleSheet.create({
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
