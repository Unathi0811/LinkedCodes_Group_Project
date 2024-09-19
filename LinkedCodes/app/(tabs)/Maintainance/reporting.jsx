import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const reports = [
  {
    id: 1,
    userProfilePhoto: require('../../../assets/user.jpeg'),
    reportImage: require('../../../assets/road.png'),
    description: 'Pothole on Main Street',
    coordinates: 'Lat: 40.7128, Long: -74.0060',
  },
  {
    id: 2,
    userProfilePhoto: require('../../../assets/user.jpeg'),
    reportImage: require('../../../assets/road.png'),
    description: 'Bridge needs maintenance',
    coordinates: 'Lat: 34.0522, Long: -118.2437',
  },
  {
    id: 3,
    userProfilePhoto: require('../../../assets/user.jpeg'),
    reportImage: require('../../../assets/road.png'),
    description: 'Cracked pavement on 5th Ave',
    coordinates: 'Lat: 41.8781, Long: -87.6298',
  },
  {
    id: 4,
    userProfilePhoto: require('../../../assets/user.jpeg'),
    reportImage: require('../../../assets/road.png'),
    description: 'Flooded area near the park',
    coordinates: 'Lat: 37.7749, Long: -122.4194',
  },
  {
    id: 5,
    userProfilePhoto: require('../../../assets/user.jpeg'),
    reportImage: require('../../../assets/road.png'),
    description: 'Damaged traffic light at the intersection',
    coordinates: 'Lat: 29.7604, Long: -95.3698',
  },
  {
    id: 6,
    userProfilePhoto: require('../../../assets/user.jpeg'),
    reportImage: require('../../../assets/road.png'),
    description: 'Missing road sign on Elm Street',
    coordinates: 'Lat: 39.0997, Long: -94.5786',
  },
];

const Reporting = () => {
  const [showAll, setShowAll] = useState(false);

  const visibleReports = showAll ? reports : reports.slice(0, 3);

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={item.userProfilePhoto} style={styles.profileImage} />
      </View>
      <View style={styles.reportContainer}>
        <Image source={item.reportImage} style={styles.reportImage} />
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.coordinates}>{item.coordinates}</Text>
      </View>
    </View>
  );

  const handleMenuPress = () => {
    console.log("Hamburger menu pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.hamburgerButton}>
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.appName}>InfraSmart</Text>
      </View>

      <FlatList
        style={styles.list}
        data={visibleReports}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          !showAll && reports.length > 3 && (
            <TouchableOpacity style={styles.moreButton} onPress={() => setShowAll(true)}>
              <Text style={styles.moreButtonText}>Show More</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
};

export default Reporting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#F2f9FB",
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
  },
  hamburgerButton: {
    padding: 10,
  },
  list: {
    marginTop: 80,
    padding: 20,
  },
  card: {
    flexDirection: 'row',
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
  profileContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#202A44',
  },
  reportContainer: {
    flex: 1,
  },
  reportImage: {
    width: '100%',
    height: 100,
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
  moreButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    color: '#202A44',
    fontWeight: 'bold',
  },
});
