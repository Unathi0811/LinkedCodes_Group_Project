import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5"; 
import { useUser } from "../../src/cxt/user"

const ConfirmationScreen = () => {
    const { setUser, user } = useUser()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Review and Confirm</Text>
      <Text style={styles.subtitle}>
        Double-check the details, then confirm your donation to complete the process.
      </Text>

       {/* Confirm Donation Button */}
       <Link href="/confirm" asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Confirm Donation</Text>
            <Icon name="arrow-right" size={20} color="#fff" style={styles.icon} />
          </View>
        </TouchableOpacity>
      </Link>

      {/* Go Back Button, here the user should be routed back to userTabs where as the officla should be routed back to tabs*/}
       <Link href={user.userType ? "/(tabs)/Home" : "/(userTabs)/home"} asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Go Back</Text>
            <Icon name="arrow-left" size={20} color="#fff" style={styles.icon} />
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    color: "#202A44",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#7D7D7D",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#202A44",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginLeft: 10,
  },
});

export default ConfirmationScreen;