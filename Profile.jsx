import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogoutConfirmModal from './LogOut.jsx';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from './firebase'; // Ensure you have Firebase auth imported

const SettingsScreen = ({ profileImage, profileData, isDarkMode }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const handleLogOutPress = () => {
    setShowModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowModal(false);
    try {
      await auth.signOut(); // Implement actual logout logic
      navigation.navigate('Login'); // Change as needed
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PersonalInformation')}>
            <Icon name="edit" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit Personal Information</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DeleteAccount')}>
            <Icon name="delete" size={20} color="#fff" />
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogOutPress}>
            <Icon name="logout" size={20} color="#fff" />
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="notifications" size={20} color="#fff" />
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EmergencyContacts')}>
            <Icon name="warning" size={20} color="#fff" />
            <Text style={styles.buttonText}>Emergency Contacts</Text>
          </TouchableOpacity>
        </View>

        {showModal && (
          <LogoutConfirmModal
            visible={showModal}
            onClose={handleModalClose}
            onConfirm={handleLogoutConfirm}
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
    borderWidth: 2,
    borderColor: '#003366',
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#003366',
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
    backgroundColor: '#202A44',
    padding: 14,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default SettingsScreen;
