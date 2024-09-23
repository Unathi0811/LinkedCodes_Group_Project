import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const SettingsButton = () => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Settings'); // Replace 'Settings' with your target screen
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={handlePress}
      >
        <Ionicons name="settings" size={37} color="grey" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5, // Adjust this value based on your layout to avoid overlap
    left: 6,
    zIndex: 1, // Ensure the icon is above other elements
  },
  iconContainer: {

    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default SettingsButton;
