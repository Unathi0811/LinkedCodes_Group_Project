import { StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router";

const Maintenance = () => {
  const handleMenuPress = () => {
    //what happens when the hamburger is pressed
    console.log("Hamburger menu pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.hamburgerButton}>
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.linkContainer}>
          <Link href="/(tabs)/Maintainance/reporting" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>REPORTING</Text>
            </Pressable>
          </Link>

          <Link href="/(tabs)/Maintainance/maintain" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>MAINTAIN</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
};

export default Maintenance;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full screen
    backgroundColor: "#fff", // Optional background color
  },
  headerContainer: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  hamburgerButton: {
    padding: 10,
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  linkContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  linkButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#e0e0e0", // Optional background for buttons
  },
  linkText: {
    color: "#202A44",
    fontSize: 16,
  },
});
