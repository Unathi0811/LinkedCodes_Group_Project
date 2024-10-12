import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
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
    },
    {
      id: 2,
      userProfilePhoto: 'https://via.placeholder.com/60',
      reportImage: 'https://via.placeholder.com/100',
      description: 'Report 2 description',
      userName: 'Lina Zulu',
    },
    {
      id: 3,
      userProfilePhoto: 'https://via.placeholder.com/60',
      reportImage: 'https://via.placeholder.com/100',
      description: 'Report 3 description',
      userName: 'Chris Noah',
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
        <Text style={styles.initials}> {getInitials(item.userName)}</Text>
      </View>
      <View style={styles.reportContainer}>
        <Image source={{ uri: item.reportImage }} style={styles.reportImage} />
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.iconContainer}>
          {/* Map icon */}
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="map-marker" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Eye icon for tracking */}
          <TouchableOpacity onPress={() => toggleTrackReport(item.id)} style={styles.iconButton}>
            <Icon
              name={trackedReports.includes(item.id) ? 'eye' : 'eye-slash'}
              size={24}
              color="#fff"
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
        <Text style={styles.appName}>InfraSmart</Text>
        {/* <TouchableOpacity onPress={handleMenuPress} style={styles.hamburgerButton}>
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity> */}
      </View>
      
      {/* filters, put them in a scrollview, that scrolls horizontally */}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.horScrollView}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Submitted</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text 
          style={styles.btnText}>In-Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Rejected</Text>
        </TouchableOpacity>
      </ScrollView>
        
      <TouchableOpacity style={styles.option}

        >
          <Text style={styles.optionText}>Reported Issues</Text>
        </TouchableOpacity>
      {/* <View style={styles.buttonContainer}>
      </View> */}
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
    backgroundColor: '#fff',
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
    marginTop: 20,
  },
  list: {
    marginTop: 80, 
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: "#202A44",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#202A44',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
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
    color: "#fff"
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
  horScrollView: {
    flex: 1,
    padding: 10,
    width: "100%",
    height: 140,
    backgroundColor: "#202A44",
  },
  btn: {
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    marginTop: 10,
    backgroundColor: "#202A44"
  },
  btnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
