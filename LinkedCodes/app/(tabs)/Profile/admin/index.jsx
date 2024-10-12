import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../../../../src/cxt/user';
import { Ionicons, Octicons  } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { FlatGrid } from 'react-native-super-grid';

const HomeScreen = () => {
  const { user } = useUser(); 
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user found. Please log in.</Text>
      </View>
    );
  }


  // grid items, a usestate with all items in it 
  const [items, setItems] = useState(
    [
      {
        title: 'Roads Monitored',
        number: '15',
      }, 
      {
        title: 'Bridges Monitored',
        number: '15',
      }, 
      {
          title: 'Incidents Reported',
        number: '15',
      }
    ]
  )
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.dashboardText}>Dashboard</Text>
        <Image
          source={{ uri: user.profileImage || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
      </View>
          {/* create a grid here of the three statBoxes */}
          <FlatGrid
            itemDimension={130}
            data={items}
            style={styles.gridView}
            // staticDimension={300}
            // fixed
            spacing={10}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemCode}>{item.number}</Text>
              </View>
            )} 
          />
          <Link asChild href={"/(tabs)/Maintenance/reporting"}>
            <TouchableOpacity style={styles.viewReportsButton}>
              <Text style={styles.viewReportsText}>View Reports</Text>
            </TouchableOpacity>
          </Link>
      {/* Scrollable Content */}
      <ScrollView style={styles.container}>
        <View style={styles.adminActionsContainer}>
          <Text style={styles.adminActionsText}>Admin Actions</Text>
          <ScrollView style={styles.actionButtons}>
            <Link href="/(tabs)/Profile/admin/audit-log" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Audit Log
                </Text>
                  <AntDesign name="table" size={20} color="black" style={styles.icon} />
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/Profile/admin/manage-officials" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Manage Officials
                </Text>
                <FontAwesome5 name="user-tie" size={18} color="black" style={styles.icon}/>
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/Profile/admin/manage-citizens" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Manage Citizens
                </Text>
                  <FontAwesome5 name="user" size={18} color="#202A44" style={styles.icon}/>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Manage Infrastructure
              </Text>
              <FontAwesome5 name="road" size={16} color="#202A44" style={styles.icon}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Schedule Maintenance
              </Text>
                <FontAwesome5 name="calendar" size={16} color="#202A44" style={styles.icon}/>  
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Analytics
              </Text>
              <FontAwesome name="bar-chart-o" size={16} color="#202A44" style={styles.icon}/>              
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',  
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#202A44',  
    zIndex: 10,  
    paddingBottom: 10,
    height: 100,
  },
  dashboardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  greetingText: {
    fontSize: 16,
    color: '#202A44',
    marginTop: 10,
  },
  statsContainer: {
    backgroundColor: '#202A44',
    borderRadius: 10,
    padding: 20,
    marginTop: 120, 
  },
  statBox: {
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewReportsButton: {
    backgroundColor: '#202A44',
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewReportsText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  adminActionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: "column",
    padding: 20,
    marginTop: 20,
  },
  adminActionsText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'column',
    height: 233,
  },
  actionButton: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    padding: 20,
    alignItems: 'flex-start',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
    height: '15%',
    marginBottom: 9,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#202A44',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  icon: {
    color: "#202A44",
  },
  gridView: {
    marginTop: 100,
    marginBottom: -180,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#202A44",
    marginTop: 10,
  },
  itemName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '400',
    fontSize: 16,
    color: '#fff',
  },
});

export default HomeScreen;
