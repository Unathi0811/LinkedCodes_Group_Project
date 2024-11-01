import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.scrollContainer} >
        <TouchableOpacity style={styles.option}
          onPress={() => {
            router.push('/(tabs)/Settings/notifications');
          }}
        >
          <Text style={styles.optionText}>Notifications</Text>
          <Icon 
            name='bell' 
            color="#fff" 
            size={22} 
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}
          onPress={() => {
            router.push('/(tabs)/Settings/support-page');
          }}
        >
          <Text style={styles.optionText}>Feedback and Support</Text>
          <Icon 
            name='comments' 
            color="#fff" 
            size={22} 
            style={styles.icon} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}
          onPress={() => {
            router.push('/(tabs)/Settings/permissions');
          }}
        >
          <Text style={styles.optionText}>Permissions</Text>
          <Icon 
            name='lock' 
            color="#fff" 
            size={22} 
            style={styles.icon} // Updated here
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Biometrics</Text>
          <Icon 
            name='fingerprint' 
            color="#fff" 
            size={22} 
            style={styles.icon}
          /> 
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2f9FB",
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: "#202A44",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 50,
    zIndex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingTop: 130,
  },
  option: {
    padding: 15,
    backgroundColor: '#202A44',
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flexDirection: "row",
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
  icon: {
    marginLeft: 10, 
  },
});
