import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const AccountActionModal = ({ visible, onClose, onConfirm, isDeleteAction, isDarkMode }) => {
  const handleCancel = () => {
    onClose(); // Simply close the modal
  };

  const handleConfirm = () => {
    onConfirm(); // Call the onConfirm function passed as a prop
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#333' : '#FFFFFF' }]}>
          <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            {isDeleteAction ? 'Confirm Delete Account' : 'Confirm Log Out'}
          </Text>
          <Text style={[styles.modalMessage, { color: isDarkMode ? '#CCCCCC' : '#000000' }]}>
            {isDeleteAction
              ? 'Are you sure you want to delete your account? This action cannot be undone.'
              : 'Are you sure you want to log out?'}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirmButton]}>
              <Text style={styles.buttonText}>{isDeleteAction ? 'Delete' : 'Log Out'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AccountActionModal;
