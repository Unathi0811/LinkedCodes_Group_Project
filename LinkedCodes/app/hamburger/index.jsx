import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { useRouter, Link } from 'expo-router'; // Import useRouter from expo-router
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from '../../firebase'; 
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

import PersonalInformation from './PersonalInformation.jsx'; // Update the path accordingly

const SettingsScreen = ({ isDarkMode }) => {
  const router = useRouter(); // Initialize the router
  const [showLogOutModal, setShowLogOutModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, 'user', userId);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setProfileData(docSnap.data());
        if (docSnap.data().profileImage) {
          setProfileImage(docSnap.data().profileImage);
        }
      } else {
        console.log('No such document!');
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchData();
      } else {
        Alert.alert('User is not authenticated');
        router.push('/Login'); // Use router.push for navigation
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogOutPress = () => {
    setShowLogOutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogOutModal(false);
    try {
      await auth.signOut();
      router.push('/Login'); // Navigate to Login after logout
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const handleDeleteAccountPress = () => {
    setShowDeleteAccountModal(true);
  };

  const handleDeleteAccountConfirm = async () => {
    const userId = auth.currentUser.uid;
    try {
      await deleteDoc(doc(db, 'user', userId));
      await auth.currentUser.delete();
      Alert.alert('Account deleted successfully!');
      router.push('/Login'); // Navigate to Login after account deletion
    } catch (error) {
      console.error('Account deletion error:', error);
      Alert.alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#EAF1FF' }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Profile</Text>

        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>No Profile Picture</Text>
            </View>
          )}
          <Text style={[styles.name, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>
            {profileData.name || 'Name'}
          </Text>
        </View>
{/* onPress={() => router.push('./PersonalInformation')} */}
        <View style={styles.buttonContainer}>
          <Link asChild href="./PersonalInformation" >
            <TouchableOpacity style={styles.button} >
              <Icon name="person" size={35} color="#003366" />
              <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}> Personal Information</Text>
            </TouchableOpacity>
          </Link>
          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={handleDeleteAccountPress}>
            <Icon name="delete" size={32} color="#003366" />
            <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Delete Account</Text>
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={handleLogOutPress}>
            <Icon name="logout" size={30} color="#003366" />
            <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Modal transparent visible={showLogOutModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Are you sure you want to log out?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={() => setShowLogOutModal(false)} style={styles.modalButton}>
                  <Text style={{ color: '#FFCC00' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogoutConfirm} style={styles.modalButton}>
                  <Text style={{ color: '#FF0000' }}>Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={showDeleteAccountModal} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Are you sure you want to delete your account?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity onPress={() => setShowDeleteAccountModal(false)} style={styles.modalButton}>
                  <Text style={{ color: '#FFCC00' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteAccountConfirm} style={styles.modalButton}>
                  <Text style={{ color: '#FF0000' }}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
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
  profilePlaceholderText: {
    color: '#6c757d',
    fontSize: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '85%',
    marginBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  separator: {
    height: 2,
    backgroundColor: '#003366',
    marginVertical: 10,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default SettingsScreen;
