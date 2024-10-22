import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';

const NotificationScreen = ({ isDarkMode }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleRemoveNotifications = () => {
    console.log("Notifications removed");
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#EAF1FF' }]}>
      <Text style={[styles.header, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Notifications</Text>
      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>
          Notifications Enabled: {isEnabled ? "On" : "Off"}
        </Text>
        <Switch
          trackColor={{ false: "#202A44", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#003366" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <TouchableOpacity onPress={handleRemoveNotifications} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove Notifications</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
    backgroundColor: '#202A44',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default NotificationScreen;
