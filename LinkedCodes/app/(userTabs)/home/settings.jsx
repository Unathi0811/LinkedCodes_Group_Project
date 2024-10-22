import React, { useState, useEffect } from 'react';
import {
    View, Text, Switch, Alert, StyleSheet,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Stack } from 'expo-router'; // Import Stack for navigation

const Settings = ({ toggleTheme, isDarkMode }) => {
    const [permissions, setPermissions] = useState({
        camera: false,
        gallery: false,
        contacts: false,
        notifications: false,
    });

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
            faceId: supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FACE_ID),
            fingerprint: supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
        });
    };

    const loadBiometricPreference = async () => {
        try {
            const value = await AsyncStorage.getItem('biometricEnabled');
            if (value) setBiometryEnabled(JSON.parse(value));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleBiometricPreference = async (type) => {
        const newValue = !biometryEnabled[type];
        const updatedBiometry = { ...biometryEnabled, [type]: newValue };
        setBiometryEnabled(updatedBiometry);

        await AsyncStorage.setItem('biometricEnabled', JSON.stringify(updatedBiometry));
        Alert.alert(
            newValue ? `${type} Enabled` : `${type} Disabled`,
            `You have ${newValue ? 'enabled' : 'disabled'} ${type.toLowerCase()} authentication.`
        );
    };

    const loadPermissions = async () => {
        const cameraPermission = await Camera.getCameraPermissionsAsync();
        const galleryPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
        const contactsPermission = await Contacts.getPermissionsAsync();
        const notificationPermission = await Notifications.getPermissionsAsync();

        setPermissions({
            camera: cameraPermission.status === 'granted',
            gallery: galleryPermission.status === 'granted',
            contacts: contactsPermission.status === 'granted',
            notifications: notificationPermission.status === 'granted',
        });
    };

    const requestPermission = async (type) => {
        let status;

        switch (type) {
            case 'camera':
                ({ status } = await Camera.requestCameraPermissionsAsync());
                break;
            case 'gallery':
                ({ status } = await ImagePicker.requestMediaLibraryPermissionsAsync());
                break;
            case 'contacts':
                ({ status } = await Contacts.requestPermissionsAsync());
                break;
            case 'notifications':
                ({ status } = await Notifications.requestPermissionsAsync());
                break;
        }

        if (status === 'granted') {
            Alert.alert('Permission Granted', `${type} access has been enabled.`);
            setPermissions((prev) => ({ ...prev, [type]: true }));
        } else {
            Alert.alert('Permission Denied', `${type} access is required for this feature.`);
        }
    };

    const handleTogglePermission = (type, enabled) => {
        if (enabled) {
            requestPermission(type);
        } else {
            Alert.alert(`${type} Access Disabled`, `You have disabled ${type} access.`);
            setPermissions((prev) => ({ ...prev, [type]: false }));
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#EAF1FF' }]}>
            <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>Settings</Text>

            <View style={styles.section}>
                <Text style={[styles.heading, { color: isDarkMode ? '#FFF' : '#000' }]}>Security & Login</Text>

                <View style={styles.switchContainer}>
                    <Text style={[styles.subHeading, { color: isDarkMode ? '#FFF' : '#000' }]}>
                        Face Recognition
                    </Text>
                    <Switch
                        value={biometryEnabled.faceId}
                        onValueChange={() => toggleBiometricPreference('faceId')}
                        disabled={!biometrySupported}
                    />
                </View>

                <View style={styles.switchContainer}>
                    <Text style={[styles.subHeading, { color: isDarkMode ? '#FFF' : '#000' }]}>
                        Finger Verification
                    </Text>
                    <Switch
                        value={biometryEnabled.fingerprint}
                        onValueChange={() => toggleBiometricPreference('fingerprint')}
                        disabled={!biometrySupported}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.heading, { color: isDarkMode ? '#FFF' : '#000' }]}>Permissions</Text>

                {['camera', 'gallery', 'contacts', 'notifications'].map((type) => (
                    <View key={type} style={styles.switchContainer}>
                        <Text style={[styles.subHeading, { color: isDarkMode ? '#FFF' : '#000' }]}>
                            {`${type.charAt(0).toUpperCase() + type.slice(1)} Access`}
                        </Text>
                        <Switch
                            value={permissions[type]}
                            onValueChange={(enabled) => handleTogglePermission(type, enabled)}
                        />
                    </View>
                ))}
            </View>

            
            <View style={styles.section}>
                <Text style={[styles.heading, { color: isDarkMode ? '#FFF' : '#000' }]}>Theme</Text>
                <View style={styles.switchContainer}>
                    <Text style={[styles.subHeading, { color: isDarkMode ? '#FFF' : '#000' }]}>
                        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                    <Switch value={isDarkMode} onValueChange={() => toggleTheme(isDarkMode ? 'light' : 'dark')} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40 },
    section: { width: '90%', marginBottom: 30, borderRadius: 10, padding: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
    heading: { fontSize: 22, fontWeight: '600', marginBottom: 15, textAlign: 'center' },
    subHeading: { fontSize: 18 },
    switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
});

export default Settings;