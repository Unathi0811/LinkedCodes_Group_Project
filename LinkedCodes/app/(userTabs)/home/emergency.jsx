import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { MaterialIcons, AntDesign, FontAwesome } from "@expo/vector-icons"; // Importing icons

const Emergency = () => {
  // Preloaded emergency contacts including public works number
  const contacts = [
    { id: "1", name: "Ambulance", phone: "067 139 4777" },
    { id: "2", name: "Department of Road and Traffic", phone: "0795822643" },
    { id: "3", name: "Public Works", phone: "065 515 8443" }, // Public works number added
  ];

  // Define SOS number (South African number)
  const sosNumber = "10111"; // South African SOS number

  const handleCallPress = (phone) => {
    const formattedPhone = `tel:${phone}`;
    Linking.canOpenURL(formattedPhone)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Unable to open dialer.");
        } else {
          return Linking.openURL(formattedPhone);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const renderContact = ({ item }) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        onPress={() => handleCallPress(item.phone)}
        style={styles.contactInfo}
      >
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </TouchableOpacity>
    </View>
  );

  const handleContactUsPress = (type) => {
    let url;
    switch (type) {
      case "facebook":
        url = "https://facebook.com/Linkedcodes";
        break;
      case "instagram":
        url = "https://instagram.com/Linkedcodes";
        break;
      case "email":
        url = "mailto:contact@linkedcodes.com";
        break;
      default:
        return;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Error", "Unable to open the link.");
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleSOSPress = () => {
    handleCallPress(sosNumber);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactList}
      />

      {/* SOS Button */}
      <TouchableOpacity onPress={handleSOSPress} style={styles.sosButton}>
        <Text style={styles.sosButtonText}>SOS</Text>
      </TouchableOpacity>

      {/* Contact Us Section */}
      <View style={styles.contactUsSection}>
        <Text style={styles.contactUsTitle}>Contact Us</Text>
        <TouchableOpacity
          onPress={() => handleContactUsPress("facebook")}
          style={styles.contactUsItem}
        >
          <MaterialIcons name="facebook" size={24} color="#3b5998" />
          <Text style={styles.contactUsText}> Facebook: Linkedcodes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleContactUsPress("instagram")}
          style={styles.contactUsItem}
        >
          <FontAwesome name="instagram" size={24} color="#E1306C" />
          <Text style={styles.contactUsText}> Instagram: Linkedcodes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleContactUsPress("email")}
          style={styles.contactUsItem}
        >
          <AntDesign name="mail" size={24} color="#D44638" />
          <Text style={styles.contactUsText}>
            {" "}
            Email: contact@linkedcodes.com
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF1FF",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#202A44",
    marginBottom: 25,
    textAlign: "center",
  },
  contactList: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  contactInfo: {
    flexDirection: "column",
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  contactPhone: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  sosButton: {
    backgroundColor: "#202A44",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  sosButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  contactUsSection: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  contactUsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginBottom: 15,
    textAlign: "center",
  },
  contactUsItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  contactUsText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#333",
  },
});

export default Emergency;
