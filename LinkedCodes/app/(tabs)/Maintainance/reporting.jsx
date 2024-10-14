import { StyleSheet, Text, View, Image, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Reporting = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const reportsCollection = collection(db, 'reports');
      const reportSnapshot = await getDocs(reportsCollection);
      const reportList = reportSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportList);
    };
    fetchReports();
  }, []);

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.userProfilePhoto || 'https://via.placeholder.com/60' }} style={styles.profileImage} />
        <Text style={styles.initials}>{item.name || 'Unknown User'}</Text>
      </View>
      <View style={styles.reportContainer}>
        <Image source={{ uri: item.image[0] || 'https://via.placeholder.com/100' }} style={styles.reportImage} />
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.iconContainer}>
          <Icon name="map-marker" size={24} color="#202A44" />
          <Icon name="eye" size={24} color="#202A44" />
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
        
        {/* <TouchableOpacity style={{
          marginTop: 34,
        }}
        >
            <Text style={styles.optionText}>Reported Issues</Text>
        </TouchableOpacity> */}

       <ScrollView 
        style={{marginTop: 34}}
       >
        { reports.length > 0 ? (
          <FlatList
            data={reports}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        ) : (
          <Text>No reports available.</Text>
        ) 
        }
      </ScrollView>
    </View>
  );
};

export default Reporting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2f9FB',
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
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "95%",
    marginBottom: 15,
    marginLeft: 10,
    shadowColor: '#202A44',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
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
    color: "#202A44"
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
    marginTop: 100,
  },
  btn: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 184,
    height: 50,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#202A44",
    marginLeft: 13,
  },
  btnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
