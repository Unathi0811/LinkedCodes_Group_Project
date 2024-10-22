

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router
import { auth } from './firebase';
import { deleteUser } from 'firebase/auth';

const DeleteAccount = ({ visible, onClose }) => {
  const router = useRouter(); // Create router instance
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
        await AsyncStorage.multiRemove(['authToken', 'userProfile', 'profilePicture']);
        Alert.alert('Success', 'Your account has been deleted.');

        // Navigate to the Login screen after deletion
        router.replace('/Login'); // Use router.replace for navigation
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Alert.alert('Error', 'An error occurred while deleting your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(); // Call the onClose function to close the modal
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel} // Close modal when back button is pressed
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Account</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete your account? This action cannot be undone.
          </Text>
          {loading && <ActivityIndicator size="small" color="#0000ff" style={{ marginBottom: 20 }} />}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel} // Close modal on cancel
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 241, 255, 0.8)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  deleteButton: {
    backgroundColor: '#f00',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DeleteAccount;
