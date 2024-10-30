import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import ReviewsAnalytics from "../../../src/components/graphs/Reviews";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";

const Analytics = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.headerApp}>InfraSmart</Text>
      </View>

      {/* ScrollView for Graphs */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ReviewsAnalytics />
        {/* Add more graph components here as needed */}
      </ScrollView>
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "center",
    padding: 20,
    zIndex: 10,
    backgroundColor: "#F2f9FB",
    height: 100,
  },
  backButton: {
    padding: 10,
    marginRight: 10, 
  },
  headerApp: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#202A44",
    marginLeft: 130, 
  },
  scrollContent: {
    paddingTop: 70, 
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
});
