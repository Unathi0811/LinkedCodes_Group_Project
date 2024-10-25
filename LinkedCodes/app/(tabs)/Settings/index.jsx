import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { router } from 'expo-router';
// import { useTheme, themes } from '../../../src/cxt/theme';

const Settings = () => {
  // const { theme, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer} >
        <TouchableOpacity style={styles.option}
          onPress={() => {
            router.push('/(tabs)/Settings/notifications' );
            }}
        >
          <Text style={styles.optionText}>Notification Settings
            {/* a bell icon that shows how many noticifications the admin has... */}
          </Text>
          <Icon 
            style={styles.bellIcon}
            name='bell' color="#fff" size={22}
          />
        </TouchableOpacity>
        {/* theme here */}
        {/* <TouchableOpacity style={styles.option} onPress={toggleTheme}>
          <Text style={[styles.optionText, { color: theme.text }]}>Theme</Text>
          <Icon
            name={theme === themes.light ? 'moon' : 'sun'}
            color={theme.text}
            size={22}
            style={styles.themeIcon}
          />
        </TouchableOpacity> */}
        
        <TouchableOpacity style={styles.option}
        onPress={() => {
          router.push('/(tabs)/Settings/support-page' );
          }}
        >
          <Text style={styles.optionText}>Feedback and Support</Text>
          <Icon 
          style={styles.feedbackIcon}
          name='comments' 
          color="#fff" 
          size={22} 
        />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}
        onPress={() => {
          router.push('/(tabs)/Settings/permissions' );
          }}
        >
          <Text style={styles.optionText}>Permissions</Text>
          <Icon 
          style={{
            marginLeft: 104,
          }}
          name='lock' 
          color="#fff" 
          size={22} 
        />
        </TouchableOpacity>
        
        {/* when this touchable opacity is pressed it should pop up an alert that has fingerprint and face recognition, both with an enable and disable button of some sort, so when pressed it can enabe the biometrics
          for the user, which means they dont have to use their passwords to login anymore, they can login using either fo thr two.
        */}
        <TouchableOpacity style={styles.option}
        >
          <Text style={styles.optionText}>Biometrics</Text>
          <Icon 
          style={styles.biometricsIcon}
          name='fingerprint' 
          color="#fff" 
          size={22} 
        /> 
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
    backgroundColor: "#202A44",
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
    gap: 70,
    alignContent: "space-between"
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
  bellIcon: {
    marginTop: 4,
    marginLeft: 21,
  },
  biometricsIcon: {
    marginLeft: 120,
  },
  themeIcon: {
    marginLeft: 156,
  },
  feedbackIcon: {
    marginRight: 166,
  }
});
