import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { router } from 'expo-router';

const Settings = () => {
  const [isLightTheme, setIsLightTheme] = useState(true);

  const toggleTheme = () => {
    setIsLightTheme((prev) => !prev);
    //  logic to actually apply the theme changes in the app
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <TouchableOpacity style={styles.option}
          onPress={() => {
            router.push('/(tabs)/Settings/notifications');
            }}
        >
          <Text style={styles.optionText}>Notification Settings
            {/* a bell icon that shows how many noticifications the admin has... */}
          </Text>
          <Icon 
          style={styles.bellIcon}
            name='bell' color="#202A44" size={22}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Theme</Text>
          <Icon 
            name={isLightTheme ? 'moon' : 'sun'} 
            color="#202A44" 
            size={22}
            style={styles.themeIcon} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}
        onPress={() => {
          router.push('/(tabs)/Maintainance/reporting');
          }}
        >
          <Text style={styles.optionText}>Reported Issues</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}
        onPress={() => {
          router.push('/(tabs)/Settings/support-page');
          }}
        >
          <Text style={styles.optionText}>Feedback and Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}
        // onPress={() => {
        //   router.push('/(tabs)/Maintainance/analytics');
        //   }}
        >
          <Text style={styles.optionText}>Analytics</Text>

        </TouchableOpacity>
        {/* when this touchable opacity is pressed it should pop up an alert that has fingerprint and face recognition, both with an enable and disable button of some sort, so when pressed it can enabe the biometrics
          for the user, which means they dont have to use their passwords to login anymore, they can login using either fo thr two.
        */}
        <TouchableOpacity style={styles.option}
        >
          <Text style={styles.optionText}>Biometrics</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202A44',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center', 
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  option: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flexDirection: "row",
    gap: 50,
  },
  optionText: {
    fontSize: 18,
    color: '#202A44',
  },
  bellIcon: {
    marginTop: 4,
    marginLeft: 21,
  },
  themeIcon: {
    marginLeft: 156,
  }
});
