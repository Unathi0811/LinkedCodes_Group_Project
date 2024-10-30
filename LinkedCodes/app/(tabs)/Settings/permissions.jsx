import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';

const PermissionsScreen = () => {
  const [permissionsStatus, setPermissionsStatus] = useState({
    location: null,
    camera: null,
    photos: null,
    contacts: null,
  });

  const router = useRouter();

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionsStatus((prev) => ({ ...prev, location: status }));
    } catch (error) {
      Alert.alert('Error', 'Failed to request location permission');
      console.error(error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermissionsStatus((prev) => ({ ...prev, camera: status }));
    } catch (error) {
      Alert.alert('Error', 'Failed to request camera permission');
      console.error(error);
    }
  };

  const requestPhotosPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionsStatus((prev) => ({ ...prev, photos: status }));
    } catch (error) {
      Alert.alert('Error', 'Failed to request photos permission');
      console.error(error);
    }
  };

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissionsStatus((prev) => ({ ...prev, contacts: status }));
    } catch (error) {
      Alert.alert('Error', 'Failed to request contacts permission');
      console.error(error);
    }
  };

  const renderPermissionStatus = (status) => {
    return status === 'granted' ? 'Allowed' : 'Not Allowed';
  };

  return (
    <View style={styles.container}>
       {/* Back Button */}
       <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#202A44" />
      </TouchableOpacity>
      <Text style={styles.header}>PERMISSIONS</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/** Permission Sections */}
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Location: {renderPermissionStatus(permissionsStatus.location)}</Text>
          <TouchableOpacity style={styles.button} onPress={requestLocationPermission}>
            <Text style={styles.buttonText}>Request Permission</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Camera: {renderPermissionStatus(permissionsStatus.camera)}</Text>
          <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
            <Text style={styles.buttonText}>Request Permission</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Photos: {renderPermissionStatus(permissionsStatus.photos)}</Text>
          <TouchableOpacity style={styles.button} onPress={requestPhotosPermission}>
            <Text style={styles.buttonText}>Request Permission</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Contacts: {renderPermissionStatus(permissionsStatus.contacts)}</Text>
          <TouchableOpacity style={styles.button} onPress={requestContactsPermission}>
            <Text style={styles.buttonText}>Request Permission</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F2f9FB',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
    color: "#202A44",
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  permissionContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  permissionText: {
    fontSize: 18,
    color: '#202A44',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#202A44',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PermissionsScreen;
