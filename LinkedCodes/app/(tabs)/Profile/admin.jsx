
{/* Header
<View style={styles.header}>
  <Text style={styles.dashboardText}>Dashboard</Text>
  <Image
    source={require('../../../assets/road.png')}
    style={styles.profileImage}
  />
</View> */}


// Styles for Home Screen
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 40,
//   },
//   dashboardText: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#3A5CAD',
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   greetingText: {
//     fontSize: 16,
//     color: '#7D7D7D',
//     marginTop: 10,
//   },
//   walletContainer: {
//     backgroundColor: '#3A5CAD',
//     borderRadius: 10,
//     padding: 20,
//     marginTop: 20,
//   },
//   walletInfo: {
//     marginBottom: 10,
//   },
//   walletLabel: {
//     fontSize: 14,
//     color: '#fff',
//   },
//   walletBalance: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   cardsInfo: {
//     marginBottom: 10,
//   },
//   cardsLabel: {
//     fontSize: 14,
//     color: '#fff',
//   },
//   cardsNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   editIDButton: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   editIDText: {
//     color: '#3A5CAD',
//     fontWeight: 'bold',
//   },
//   changeProfileContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     marginTop: 20,
//   },
//   changeProfileText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   profileOptions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   profileBox: {
//     backgroundColor: '#F1F1F1',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     width: '30%',
//   },
//   profileBoxText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#3A5CAD',
//   },
//   profileName: {
//     fontSize: 14,
//     color: '#7D7D7D',
//     marginTop: 5,
//     textAlign: 'center',
//   },
// });

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../../../src/cxt/user';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { user } = useUser(); 

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dashboardText}>Admin {"\n"}Dashboard</Text>
        <Image
    source={require('../../../assets/road.png')}
    style={styles.profileImage}
  />
      </View>
      

      {/* instead of adim, eplace with users name */}
      <Text style={styles.greetingText}>Welcome, Admin</Text>

      {/* Infrastructure Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Roads Monitored</Text>
          <Text style={styles.statNumber}>15</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Incidents Reported</Text>
          <Text style={styles.statNumber}>3</Text>
        </View>
        <TouchableOpacity style={styles.viewReportsButton}>
          <Text style={styles.viewReportsText}>View Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Admin Actions */}
      <View style={styles.adminActionsContainer}>
        <Text style={styles.adminActionsText}>Admin Actions</Text>
        <ScrollView style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Manage Infrastructure</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Schedule Maintenance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Analytics</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

    </View>
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
    marginTop: 40,
  },
  dashboardText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#202A44',
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
    marginTop: 20,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewReportsText: {
    color: '#202A44',
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'column',
  },
  actionButton: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    height: '30%',
    marginBottom: 10,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#202A44',
  },
});

export default HomeScreen;
