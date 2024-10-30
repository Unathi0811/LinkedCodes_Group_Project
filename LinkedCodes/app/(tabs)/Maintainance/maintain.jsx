import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Calendar from "../../../src/components/Calender";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
const Mantain = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.appName}>InfraSmart</Text>
      </View>
      <View style={styles.calendarCard}>
        <Calendar />
      </View>
    </View>
  );
};

export default Mantain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
    paddingTop: 70,
  },
  backButton: {
    position: "absolute",
    top: 34,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    zIndex: 10,
    backgroundColor: "#F2f9FB",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginTop: 18,
    marginLeft: 199,
  },
  cardContainer: {
    flex: 1,
    marginTop: 80,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202A44",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  calendarCard: {
    flex: 4,
    marginTop: 22,
    marginBottom: 6,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
