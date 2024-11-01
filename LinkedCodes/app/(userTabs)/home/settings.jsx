import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../../../src/cxt/theme'; // Import useTheme

const PermissionSwitch = ({ title, value, onToggle }) => {
    const { theme } = useTheme(); // Get the current theme for styling
    return (
        <View style={styles.switchContainer}>
            <Text style={[styles.subHeading, { color: theme.text }]}>{title}</Text>
            <Switch value={value} onValueChange={onToggle} />
        </View>
    );
};

const Settings = () => {
    const { theme, toggleTheme } = useTheme(); // Use the useTheme hook
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
        try {
            const storedPermissions = await AsyncStorage.getItem('permissions');
            if (storedPermissions) {
                setPermissions(JSON.parse(storedPermissions));
            } else {
                const cameraPermission = await Camera.getCameraPermissionsAsync();
                const galleryPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
                const contactsPermission = await Contacts.getPermissionsAsync();
                const notificationPermission = await Notifications.getPermissionsAsync();

                const initialPermissions = {
                    camera: cameraPermission.status === 'granted',
                    gallery: galleryPermission.status === 'granted',
                    contacts: contactsPermission.status === 'granted',
                    notifications: notificationPermission.status === 'granted',
                };

                setPermissions(initialPermissions);
                await AsyncStorage.setItem('permissions', JSON.stringify(initialPermissions));
            }
        } catch (error) {
            console.error(error);
        }
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
            setPermissions((prev) => {
                const updatedPermissions = { ...prev, [type]: true };
                AsyncStorage.setItem('permissions', JSON.stringify(updatedPermissions)); // Update stored permissions
                return updatedPermissions;
            });
        } else {
            Alert.alert('Permission Denied', `${type} access is required for this feature.`);
            setPermissions((prev) => ({ ...prev, [type]: false })); // Set permission to false
        }
    };

    const handleTogglePermission = (type, enabled) => {
        if (enabled) {
            requestPermission(type);
        } else {
            Alert.alert(
                'Access Change',
                `You have disabled ${type} access. Please note that you may need to adjust this in your device settings.`
            );
            setPermissions((prev) => {
                const updatedPermissions = { ...prev, [type]: false }; // Update state to reflect the change
                AsyncStorage.setItem('permissions', JSON.stringify(updatedPermissions)); // Update stored permissions
                return updatedPermissions;
            });
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

            <View style={styles.section}>
                <Text style={[styles.heading, { color: theme.text }]}>Security & Login</Text>

                <PermissionSwitch
                    title="Face Recognition"
                    value={biometryEnabled.faceId}
                    onToggle={() => toggleBiometricPreference('faceId')}
                />

                <PermissionSwitch
                    title="Finger Verification"
                    value={biometryEnabled.fingerprint}
                    onToggle={() => toggleBiometricPreference('fingerprint')}
                />
            </View>

            <View style={styles.section}>
                <Text style={[styles.heading, { color: theme.text }]}>Permissions</Text>

                {['camera', 'gallery', 'contacts', 'notifications'].map((type) => (
                    <PermissionSwitch
                        key={type}
                        title={`${type.charAt(0).toUpperCase() + type.slice(1)} Access`}
                        value={permissions[type]}
                        onToggle={(enabled) => handleTogglePermission(type, enabled)}
                    />
                ))}
            </View>

            <View style={styles.section}>
                <Text style={[styles.heading, { color: theme.text }]}>Theme</Text>
                <View style={styles.switchContainer}>
                    <Text style={[styles.subHeading, { color: theme.text }]}>
                        {theme === theme.dark ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                    <Switch value={theme === theme.dark} onValueChange={toggleTheme} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    section: {
        width: '100%',
        marginBottom: 30,
        borderRadius: 10,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    heading: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 15,
        textAlign: 'center',
    },
    subHeading: {
        fontSize: 18,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default Settings;
