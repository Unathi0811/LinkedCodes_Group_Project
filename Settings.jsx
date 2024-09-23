import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Settings = ({ toggleTheme, isDarkMode }) => {
  const navigation = useNavigation();

  const handleToggleTheme = () => {
    toggleTheme(!isDarkMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#EAF1FF' }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Settings</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('BiometricSettings')}
        >
          <Icon name="fingerprint" size={24} color="white" />
          <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : 'white' }]}>Biometrics</Text>
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Change Mode:</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#E6F0FF" }}
            thumbColor={isDarkMode ? "#003366" : "#f4f3f4"}
            onValueChange={handleToggleTheme}
            value={isDarkMode}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UserReviews')}
        >
          <Icon name="rate-review" size={24} color="white" />
          <Text style={[styles.buttonText, { color: isDarkMode ? '#FFFFFF' : 'white' }]}>User Reviews</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#202A44',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 10,
    
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '80%',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
  },
 

});

export default Settings;
