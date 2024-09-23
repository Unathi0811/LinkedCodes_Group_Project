import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage } from './firebase'; // Adjust this import based on your directory structure
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PersonalInformation = ({ profileImage, setProfileImage, profileData, navigation, isDarkMode }) => {
  const [formValues, setFormValues] = useState(profileData);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    setFormValues(profileData);
  }, [profileData]);

  const handleChange = (name, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleEmailBlur = (email) => {
    setEmailError(validateEmail(email) ? '' : 'Invalid email format');
  };

  const handlePhoneBlur = (phone) => {
    setPhoneError(validatePhone(phone) ? '' : 'Phone number must be exactly 10 digits');
  };

  const handleSubmit = async () => {
    if (!validateEmail(formValues.email)) {
      Alert.alert('Please enter a valid email before submitting.');
      return;
    }
    if (!validatePhone(formValues.phone)) {
      Alert.alert('Phone number must be exactly 10 digits.!');
      return;
    }

    let imageUrl = '';
    if (profileImage) {
      try {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `profileImages/${Date.now()}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Image upload error:', error);
        Alert.alert('Failed to upload image. Please try again.');
        return;
      }
    }

    try {
      const userDocRef = doc(db, 'personalInformation', 'userProfile');
      await setDoc(userDocRef, { ...formValues, profileImage: imageUrl });
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
            onBlur={() => {
              if (field === 'email') handleEmailBlur(formValues.email);
              if (field === 'phone') handlePhoneBlur(formValues.phone);
            }}
            value={formValues[field]}
            style={[styles.input, { color: textColor }]}
            placeholderTextColor={placeholderColor}
            keyboardType={field === 'phone' ? 'numeric' : 'default'}
          />
          {field === 'email' && emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          {field === 'phone' && phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
});

export default PersonalInformation;
