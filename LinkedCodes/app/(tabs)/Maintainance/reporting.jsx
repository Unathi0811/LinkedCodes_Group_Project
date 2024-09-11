import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const Reporting = () => {
  const reports = [
    {
      id: 1,
      image: require('../../../assets/road.png'),
      description: 'Pothole on Main Street',
      coordinates: 'Lat: 40.7128, Long: -74.0060',
    },
    {
      id: 2,
      image: require('../../../assets/road.png'),
      description: 'Bridge needs maintenance',
      coordinates: 'Lat: 34.0522, Long: -118.2437',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reporting</Text>
      {reports.map((report) => (
        <View key={report.id} style={styles.card}>
          <Image source={report.image} style={styles.image} />
          <Text style={styles.description}>{report.description}</Text>
          <Text style={styles.coordinates}>{report.coordinates}</Text>
        </View>
      ))}
    </View>
  );
};

export default Reporting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  coordinates: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});
