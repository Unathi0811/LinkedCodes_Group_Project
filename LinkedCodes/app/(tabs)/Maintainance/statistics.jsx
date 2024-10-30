import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';

const Stats = () => {
  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Statistics Dashboard</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Repair Statistics</Text>
          <Text style={styles.stat}>Average Repair Duration: 6 months</Text>
          <Text style={styles.stat}>Percentage of Repairs Lasting Beyond 1 Year: 75%</Text>
          <Text style={styles.stat}>Average Time Between Repairs: 9 months</Text>
        </View>

        {/* Predictions Section */}
        <View style={styles.predictionsSection}>
          <Text style={styles.predictionsTitle}>Predictions</Text>
          <Text style={styles.prediction}>Estimated Lifespan of Recent Repairs: 8 months</Text>
          <Text style={styles.prediction}>Likely Failure Points: 20% on Bridges</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  header: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202A44',
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3,
    shadowRadius: 3, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 23
  },
  scrollContent: {
    padding: 20,
  },
  statsSection: {
    width: "100%",
    backgroundColor: "#E8F4F8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#202A44",
  },
  stat: {
    fontSize: 16,
    color: "#202A44",
    marginBottom: 5,
  },
  predictionsSection: {
    width: "100%",
    backgroundColor: "#E8F4F8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  predictionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#202A44",
  },
  prediction: {
    fontSize: 16,
    color: "#202A44",
    marginBottom: 5,
  },
});
