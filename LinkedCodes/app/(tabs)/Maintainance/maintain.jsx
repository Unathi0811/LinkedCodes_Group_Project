import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import Calendar from "../../components/Calender";
import Icon from "react-native-vector-icons/FontAwesome";

const Mantain = () => {
  const handleMenuPress = () => {
    console.log("Hamburger menu pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* <TouchableOpacity
          onPress={handleMenuPress}
          style={styles.hamburgerButton}
        >
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity> */}
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
    backgroundColor: "#fff",
    paddingTop: 70,
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
    backgroundColor: "#fff",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginTop: 18,
  },
  hamburgerButton: {
    padding: 10,
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
    marginTop: 20,
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
