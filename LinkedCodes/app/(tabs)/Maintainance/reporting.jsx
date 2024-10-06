import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const Reporting = () => {
  const reports = [
    {
      id: 1,
      userProfilePhoto: 'https://via.placeholder.com/60',
      reportImage: 'https://via.placeholder.com/100',
      description: 'Report 1 description',
      userName: 'Uathi Suru',
      coordinates: '12.34, 56.78',
    },
    {
      id: 2,
      userProfilePhoto: 'https://via.placeholder.com/60',
      reportImage: 'https://via.placeholder.com/100',
      description: 'Report 2 description',
      userName: 'Lina Zulu',
      coordinates: '98.76, 54.32',
    },
    {
      id: 3,
      userProfilePhoto: 'https://via.placeholder.com/60',
      reportImage: 'https://via.placeholder.com/100',
      description: 'Report 3 description',
      userName: 'Chris Noah',
      coordinates: '34.56, 78.90',
    },
  ];

  const [trackedReports, setTrackedReports] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const toggleTrackReport = (id) => {
    if (trackedReports.includes(id)) {
      setTrackedReports(trackedReports.filter((reportId) => reportId !== id));
    } else {
      setTrackedReports([...trackedReports, id]);
    }
  };

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(' ');
    return firstName[0] + (lastName ? lastName[0] : '');
  };

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.userProfilePhoto }} style={styles.profileImage} />
        <Text style={styles.initials}>{getInitials(item.userName)}</Text>
      </View>
      <View style={styles.reportContainer}>
        <Image source={{ uri: item.reportImage }} style={styles.reportImage} />
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.coordinates}>Coordinates: {item.coordinates}</Text>

        <View style={styles.iconContainer}>
          {/* Map icon */}
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="map-marker" size={24} color="#202A44" />
          </TouchableOpacity>

          {/* Eye icon for tracking */}
          <TouchableOpacity onPress={() => toggleTrackReport(item.id)} style={styles.iconButton}>
            <Icon
              name={trackedReports.includes(item.id) ? 'eye' : 'eye-slash'}
              size={24}
              color="#202A44"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleMenuPress = () => {
    console.log("Hamburger menu pressed");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.hamburgerButton}>
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.appName}>InfraSmart</Text>
      </View>

      {/* Report List */}
      <FlatList
        style={styles.list}
        data={showAll ? reports : reports.slice(0, 3)}
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
    marginTop: 80, // Adjusting margin to account for header
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#F2f9FB",
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
  initials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202A44',
    textAlign: 'center',
    marginTop: 5,
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  iconButton: {
    marginRight: 15,
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
