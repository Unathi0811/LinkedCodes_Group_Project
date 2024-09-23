import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';

const BiometricSettings = ({ isDarkMode }) => {
  const navigation = useNavigation();
  const [biometryType, setBiometryType] = useState(null);

  // Check for biometric availability
  const checkBiometry = async () => {
    try {
      const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
      const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (hasBiometrics) {
        if (supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FACE_ID)) {
          setBiometryType('Face ID');
        } else if (supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometryType('Fingerprint');
        } else {
          setBiometryType('Other Biometry');
        }
      } else {
        Alert.alert('Biometry not available', 'Your device does not support biometric authentication or you have not enrolled any biometrics.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while checking biometric availability.');
    }
  };

  // Perform authentication
  const authenticate = async (biometryType) => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirm your identity',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        Alert.alert('Success', 'Authentication successful!!');
      } else {
        Alert.alert('Failed', 'Authentication failed!!.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during authentication.');
    }
  };

  const handleAuthentication = async () => {
    if (biometryType === 'Face ID') {
      await authenticate(LocalAuthentication.AuthenticationType.FACE_ID);
    } else if (biometryType === 'Fingerprint') {
      await authenticate(LocalAuthentication.AuthenticationType.FINGERPRINT);
    } else {
      Alert.alert('Error', 'No supported biometric authentication method available.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#E6F0FF' }]}>
      
      <Text style={[styles.header, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Biometric Authentication</Text>
      <TouchableOpacity style={styles.button} onPress={checkBiometry}>
        <Text style={styles.buttonText}>Check Biometry Availability</Text>
      </TouchableOpacity>
      {biometryType && (
        <View>
          <Text style={[styles.text, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Biometry Type: {biometryType}</Text>
          <TouchableOpacity style={styles.button} onPress={handleAuthentication}>
            <Text style={styles.buttonText}>Authenticate with {biometryType}</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={() => authenticate(null)}>
        <Text style={styles.buttonText}>Authenticate with Passcode</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#202A44',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
  },
});

export default BiometricSettings;
