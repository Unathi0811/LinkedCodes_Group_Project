import { StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView, Image } from "react-native";
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
        <Text style={styles.appName}>InfraSmart</Text>
        <TouchableOpacity onPress={handleMenuPress} style={styles.hamburgerButton}>
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity>
      </View>
      <ScrollView  style={styles.contentContainer}>
        {/* Buttons for Reporting and Maintenance */ }
        <View style={styles.linkContainer} asChild>
          <Link href="/(tabs)/Maintenance/reporting" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>REPORTING</Text>
              <Icon name="chevron-right" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/Maintenance/maintain" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>MAINTAIN</Text>
              <Icon name="chevron-right" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>
          </Link> 
          <Link href="/(tabs)/Maintenance/analytics" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>ANALYTICS</Text>
              <Icon name="chevron-right" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>
          </Link>

          <Link href="/(tabs)/Maintenance/statistics" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>STATISTICS</Text>
              <Icon name="chevron-down" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>
          </Link>
        </View>
        <View
        style={styles.card}
        >
        <Image 
          source={require("../../../assets/graph1.jpeg")}
          style={styles.image}
        />
        </View>
      </ScrollView>
    </View>
  );
};

export default Maintenance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  headerContainer: {
    position: "absolute",
    top: 6,
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
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  linkButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#202A44",
    height: 53,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 123,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#202A44",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
    padding: 15,
    marginVertical: 10,
    height: 280 ,
    flexDirection: "column"
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
});