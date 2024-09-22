import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';

const EditProfile = () => {
  const [username, setUsername] = useState('Skyler Suru');
  const [email, setEmail] = useState('skyler@gmail.com');
  const [mobile, setMobile] = useState('0823116867');

  const handleSave = () => {
    // Implement save functionality (e.g., updating profile info in the database)
    console.log('Profile Saved:', { username, email, mobile });
  };

  const handleDeleteAccount = () => {
    // Implement delete account functionality (e.g., deleting user data from the database)
    console.log('Account Deleted');
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL, replace with actual image source
        />
        <TouchableOpacity  onPress={() => {/* Handle photo change */}} >
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    color: "#202A44",
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 44,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#202A44',
    marginLeft: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    elevation: 5,
    height: 50,
    fontSize: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#202A44",
  },
  buttonContainer: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    color: "#202A44",
    fontWeight: "bold",
    marginLeft: 84,
    fontSize: 18,
  },
  changePhotoText: {
    color: "#202A44",
    fontWeight: "bold",
    marginLeft: 14,
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 20,
    width: "100%",
    marginLeft: 0,
    elevation: 5,
    alignItems: 'center', 
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#000",
  },
  deleteButtonText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default EditProfile;
