import React, { useState, useEffect } from "react";
import { View, Text, Switch, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Contacts from "expo-contacts";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

const Settings = () => {
  const [permissions, setPermissions] = useState({
    camera: false,
    gallery: false,
    contacts: false,
    notifications: false,
  });

  const router = useRouter();

  const [biometryEnabled, setBiometryEnabled] = useState({
    faceId: false,
    fingerprint: false,
  });

  const [biometrySupported, setBiometrySupported] = useState(false);

  useEffect(() => {
    checkBiometryAvailability();
    loadPermissions();
    loadBiometricPreference();
  }, []);

  const checkBiometryAvailability = async () => {
    const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
    const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

    setBiometrySupported(hasBiometrics && supportedBiometrics.length > 0);

    setBiometryEnabled({
      faceId: supportedBiometrics.includes(
        LocalAuthentication.AuthenticationType.FACE_ID
      ),
      fingerprint: supportedBiometrics.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      ),
    });
  };

  const loadBiometricPreference = async () => {
    try {
      const value = await AsyncStorage.getItem("biometricEnabled");
      if (value) setBiometryEnabled(JSON.parse(value));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleBiometricPreference = async (type) => {
    const newValue = !biometryEnabled[type];
    const updatedBiometry = { ...biometryEnabled, [type]: newValue };
    setBiometryEnabled(updatedBiometry);

    await AsyncStorage.setItem(
      "biometricEnabled",
      JSON.stringify(updatedBiometry)
    );
    Alert.alert(
      newValue ? `${type} Enabled` : `${type} Disabled`,
      `You have ${newValue ? "enabled" : "disabled"} ${type.toLowerCase()} authentication.`
    );
  };

  const loadPermissions = async () => {
    const cameraPermission = await Camera.getCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    const contactsPermission = await Contacts.getPermissionsAsync();
    const notificationPermission = await Notifications.getPermissionsAsync();

    setPermissions({
      camera: cameraPermission.status === "granted",
      gallery: galleryPermission.status === "granted",
      contacts: contactsPermission.status === "granted",
      notifications: notificationPermission.status === "granted",
    });
  };

  const requestPermission = async (type) => {
    let status;

    switch (type) {
      case "camera":
        ({ status } = await Camera.requestCameraPermissionsAsync());
        break;
      case "gallery":
        ({ status } = await ImagePicker.requestMediaLibraryPermissionsAsync());
        break;
      case "contacts":
        ({ status } = await Contacts.requestPermissionsAsync());
        break;
      case "notifications":
        ({ status } = await Notifications.requestPermissionsAsync());
        break;
    }

    if (status === "granted") {
      Alert.alert("Permission Granted", `${type} access has been enabled.`);
      setPermissions((prev) => ({ ...prev, [type]: true }));
    } else {
      Alert.alert(
        "Permission Denied",
        `${type} access is required for this feature.`
      );
    }
  };

  const handleTogglePermission = (type, enabled) => {
    if (enabled) {
      requestPermission(type);
    } else {
      Alert.alert(
        `${type} Access Disabled`,
        `You have disabled ${type} access.`
      );
      setPermissions((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(userTabs)/")}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={20} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.headerApp}>InfraSmart</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.section}>
          <Text style={styles.heading}>Security & Login</Text>

          <View style={styles.switchContainer}>
            <Text style={styles.subHeading}>Face Recognition</Text>
            <Switch
              value={biometryEnabled.faceId}
              onValueChange={() => toggleBiometricPreference("faceId")}
              disabled={!biometrySupported}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.subHeading}>Finger Verification</Text>
            <Switch
              value={biometryEnabled.fingerprint}
              onValueChange={() => toggleBiometricPreference("fingerprint")}
              disabled={!biometrySupported}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Permissions</Text>

          {["camera", "gallery", "contacts", "notifications"].map((type) => (
            <View key={type} style={styles.switchContainer}>
              <Text style={styles.subHeading}>
                {`${type.charAt(0).toUpperCase() + type.slice(1)} Access`}
              </Text>
              <Switch
                value={permissions[type]}
                onValueChange={(enabled) => handleTogglePermission(type, enabled)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 70,
  },
  section: {
    borderColor: "#202A44",
    height: 190,
    width: "90%",
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 5,
    fontSize: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowColor: "#202A44",
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#202A44",
  },
  subHeading: { fontSize: 18 },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
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
    borderBottomColor: "#ccc",
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
});

export default Settings;
