import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../../../../src/cxt/user';
import { Ionicons, Octicons  } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';

const HomeScreen = () => {
  const { user } = useUser(); 
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user found. Please log in.</Text>
      </View>
    );
  }

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

      {/* Scrollable Content */}
      <ScrollView style={styles.container}>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Roads Monitored</Text>
            <Text style={styles.statNumber}>15</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Bridges Monitored</Text>
            <Text style={styles.statNumber}>15</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Incidents Reported</Text>
            <Text style={styles.statNumber}>3</Text>
          </View>

          <Link asChild href={"/(tabs)/Maintenance/reporting"}>
            <TouchableOpacity style={styles.viewReportsButton}>
              <Text style={styles.viewReportsText}>View Reports</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.adminActionsContainer}>
          <Text style={styles.adminActionsText}>Admin Actions</Text>
          <ScrollView style={styles.actionButtons}>
            <Link href="/(tabs)/Profile/admin/audit-log" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Audit Log</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/Profile/admin/manage-officials" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Manage Officials</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/Profile/admin/manage-citizens" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Manage Citizens</Text>
              </TouchableOpacity>
            </Link>
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
    alignItems: 'center',
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
});

export default HomeScreen;
