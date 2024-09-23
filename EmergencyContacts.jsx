import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const EmergencyContact = ({ isDarkMode }) => {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#EAF1FF' }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>Emergency Contacts</Text>
        
        <Text style={[styles.category, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>🔒 General Emergency Services</Text>
        <Text style={[styles.contactItem, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>🌪️ Disaster Management: 0800 222 771</Text>
        
        <Text style={[styles.category, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>⚠️ Infrastructure and Utility Services</Text>
        <Text style={[styles.contactItem, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>🛣️ Road Maintenance Issues: Contact your local municipality's road department</Text>
        <Text style={[styles.contactItem, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>🚥 Traffic Signal Faults: 0860 012 131</Text>

        <Text style={[styles.category, { color: isDarkMode ? '#FFFFFF' : '#003366' }]}>🚦 Road Safety and Traffic</Text>
        <Text style={[styles.contactItem, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>🚓 SAPS (South African Police Service!): 10111</Text>
        <Text style={[styles.contactItem, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>🛣️ Road Traffic Accidents: 0861 562 874!</Text>
      </ScrollView>

    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  category: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  contactItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202A44',
    padding: 15,
    borderRadius: 5,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  backButtonText: {
    fontSize: 16,
  },
});

export default EmergencyContact;
