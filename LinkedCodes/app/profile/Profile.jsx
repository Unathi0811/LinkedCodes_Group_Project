
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import AccountActionModal from './LogOut'; // Ensure the path is correct
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from './firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

const AccountSettingsScreen = () => {
  const navigation = useNavigation();
  const { isDarkMode } = navigation.getState().routes[1]?.params || {}; // Get params from navigation state
  const [profileData, setProfileData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteAction, setIsDeleteAction] = useState(false); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(db, 'user', userId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setProfileData(data);
          setProfileImage(data.profileImage);
        } else {
          console.log('No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogOutPress = () => {
    setIsDeleteAction(false);
    setShowModal(true);
  };

  const handleDeleteAccountPress = () => {
    setIsDeleteAction(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleActionConfirm = async () => {
    setShowModal(false);
    const userId = auth.currentUser.uid;

    if (isDeleteAction) {
      try {
        const userDocRef = doc(db, 'user', userId);
        await deleteDoc(userDocRef);
        await auth.currentUser.delete();
        navigation.navigate('Login');
      } catch (error) {
        console.error('Error deleting account:', error);
        Alert.alert('Error', 'Failed to delete account. Please try again.');
      }
    } else {
      try {
        await auth.signOut();
        navigation.navigate('Login');
      } catch (error) {
        console.error('Logout error:', error);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
    }
  };

  const updateProfileData = (updatedData) => {
    setProfileData(updatedData);
    setProfileImage(updatedData.profileImage);
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
            {profileData.username || 'Name'}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => 
              navigation.navigate('PersonalInformation', { 
                setProfileImage, 
                setProfileData: updateProfileData, 
                profileImage, 
                isDarkMode 
              })
            }>
            <Icon name="person" size={35} color={isDarkMode ? '#FFFFFF' : '#003366'} />
            <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Personal Information</Text>
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={handleDeleteAccountPress}>
            <Icon name="delete" size={32} color={isDarkMode ? '#FFFFFF' : '#003366'} />
            <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Delete Account</Text>
          </TouchableOpacity>
          <View style={styles.separator} />

          <TouchableOpacity style={styles.button} onPress={handleLogOutPress}>
            <Icon name="logout" size={30} color={isDarkMode ? '#FFFFFF' : '#003366'} />
            <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Log Out</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>

        {showModal && (
          <AccountActionModal
            visible={showModal}
            onClose={handleModalClose}
            onConfirm={handleActionConfirm}
            isDeleteAction={isDeleteAction}
            isDarkMode={isDarkMode}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#444', // Button background
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#FFFFFF', // Button text color
  },
  separator: {
    height: 1,
    backgroundColor: '#003366',
    marginVertical: 10,
  },
});

export default AccountSettingsScreen;
