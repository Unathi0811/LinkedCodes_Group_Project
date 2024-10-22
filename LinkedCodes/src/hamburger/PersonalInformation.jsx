import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../../firebase'; // Import auth to get user ID
//import { useRouter } from 'expo-router';

const PersonalInformation = ({ profileImage, setProfileImage, navigation, isDarkMode }) => {
  const [formValues, setFormValues] = useState({
    Username: '',
    title: '',
    location: '',
    email: '',
    phone: '',
  });

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser.uid; // Get the authenticated user's ID
      const userDocRef = doc(db, 'user', userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setFormValues(docSnap.data());
        if (docSnap.data().profileImage) {
          setProfileImage(docSnap.data().profileImage); // Load existing image
        }
      } else {
        console.log('No such document!');
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchData(); // Fetch data if user is authenticated
      } else {
        Alert.alert('User is not authenticated');
        navigation.goBack();
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleChange = (name, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const userId = auth.currentUser.uid; // Get the authenticated user's ID
    const userDocRef = doc(db, 'user', userId);

    try {
      await setDoc(userDocRef, { ...formValues }, { merge: true });
      Alert.alert('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Firestore update error:', error);
      Alert.alert('Failed to update profile. Please try again.');
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const placeholderColor = isDarkMode ? '#CCCCCC' : '#AAAAAA';
  const backgroundColor = isDarkMode ? '#000000' : '#EAF1FF';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <View style={styles.profileContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profilePicture} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={[styles.profilePictureText, { color: textColor }]}>No Profile Picture</Text>
          </View>
        )}
        <Button title="Change Picture" onPress={pickImage} color="#202A44" />
      </View>

      {['name', 'title', 'location', 'email', 'phone'].map((field) => (
        <View key={field} style={styles.inputContainer}>
          <Text style={[styles.label, { color: textColor }]}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
          <TextInput
            onChangeText={(value) => handleChange(field, value)}
            value={formValues[field]}
            style={[styles.input, { color: textColor }]}
            placeholderTextColor={placeholderColor}
          />
          <View style={styles.line} />
        </View>
      ))}

      <Button onPress={handleSubmit} title="Submit" color="#202A44" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e9ecef',
    marginBottom: 10,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profilePictureText: {
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    paddingVertical: 8,
    marginBottom: 5,
    borderWidth: 0,
    paddingHorizontal: 10,
  },
  line: {
    height: 1,
    backgroundColor: '#ccc',
    width: '100%',
    marginTop: 5,
  },
});

export default PersonalInformation;
