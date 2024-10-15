import { StyleSheet, Text, View, Image, FlatList, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase'; 
import { collection, getDocs, query, where } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../../../src/cxt/user'; 

export default function Reporting() {
  const { user } = useUser();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Submitted'); 

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return; 

      try {
        const reportsRef = collection(db, 'reports');
        const q = query(reportsRef, where('uid', '==', user.uid));
        const reportSnapshot = await getDocs(q);
        const reportList = reportSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReports(reportList);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const filteredReports = reports.filter(report => report.status === filter); 

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

  const handleFilterPress = (status) => {
    setFilter(status); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.appName}>InfraSmart</Text>
      </View>
      
      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horScrollView}>
        {['Submitted', 'In-Progress', 'Completed', 'Rejected'].map(status => (
          <TouchableOpacity key={status} style={styles.btn} onPress={() => handleFilterPress(status)}>
            <Text style={styles.btnText}>{status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator size="large" color="#202A44" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={{ marginTop: 34 }}>
          {filteredReports.length > 0 ? (
            <FlatList
              data={filteredReports}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.list}
            />
          ) : (
            <Text>No reports available for this status.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

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
    padding: 20,
    flexDirection: "row",
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
