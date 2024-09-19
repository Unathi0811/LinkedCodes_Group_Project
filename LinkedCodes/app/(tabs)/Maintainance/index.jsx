import { StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router";

const Maintenance = () => {
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

      <ScrollView  style={styles.contentContainer}>
        {/* Buttons for Reporting and Maintenance */}
        <View style={styles.linkContainer} asChild>
          <Link href="/(tabs)/Maintenance/reporting" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>REPORTING</Text>
            </Pressable>
          </Link>

          <Link href="/(tabs)/Maintenance/maintain" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>MAINTAIN</Text>
            </Pressable>
          </Link>
        </View>

        {/* Statistics Section 
          this is where I was thining of putting the analytics charts, for repairs and life span for the repairs
        */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Repair Statistics</Text>
          <Text style={styles.stat}>Average Repair Duration: 6 months</Text>
          <Text style={styles.stat}>Percentage of Repairs Lasting Beyond 1 Year: 75%</Text>
          <Text style={styles.stat}>Average Time Between Repairs: 9 months</Text>
        </View>

        {/* Predictions Section 
          this is where I was thining of putting the analytics charts, for predictions and how accurate the predictions are
        */}
        <View style={styles.predictionsSection}>
          <Text style={styles.predictionsTitle}>Predictions</Text>
          <Text style={styles.prediction}>Estimated Lifespan of Recent Repairs: 8 months</Text>
          <Text style={styles.prediction}>Likely Failure Points: 20% on Bridges</Text>
        </View>

      </ScrollView>
    </View>
  );
};

export default Maintenance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
},
appName: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#202A44",
},
  hamburgerButton: {
    padding: 10,
  },
  contentContainer: {
    marginTop: 90,
        paddingHorizontal: 20,
  },
  linkContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  linkButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#202A44",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
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
  suggestionsSection: {
    width: "100%",
    backgroundColor: "#E8F4F8",
    borderRadius: 10,
    padding: 15,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#202A44",
  },
  suggestion: {
    fontSize: 16,
    color: "#202A44",
    marginBottom: 5,
  },
});
