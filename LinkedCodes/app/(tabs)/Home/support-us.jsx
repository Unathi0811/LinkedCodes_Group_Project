import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

const SupportUs = () => {
  const router = useRouter();

  return (
    <View style={{
      flex: 1,
      backgroundColor: "#F2f9FB"
    }}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/")}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.headerApp}>InfraSmart</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text
        style={{
          fontSize: 24,
          color: "#202A44",
          marginBottom: 15,
          fontWeight: "bold"
        }}
        >Support InfraSmart</Text>
        <Text style={styles.description}>
          Your generous donations help us maintain and improve our roads and
          bridges, ensuring that our community remains safe and accessible.
          Every contribution goes directly towards essential repairs, upgrades,
          and enhancements to our infrastructure, allowing us to provide better
          services to our citizens. Join us in making a difference!
        </Text>
        <Link href="/(payment)/" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Proceed To Payment</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2f9FB",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    height: 90,
    marginBottom: 5,
    borderBlockEndColor: "#ccc",
  },
  backButton: {
    padding: 10,
    marginRight: 10,
    marginTop: 12,
  },
  headerApp: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#202A44",
    marginLeft: 130,
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#202A44",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SupportUs;
