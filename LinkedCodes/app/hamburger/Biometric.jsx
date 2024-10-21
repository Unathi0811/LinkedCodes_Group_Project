import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BiometricSetup = ({ isDarkMode }) => {
    const [biometryEnabled, setBiometryEnabled] = useState(false);
    const [biometryType, setBiometryType] = useState(null);

    useEffect(() => {
        checkBiometryAvailability();
        loadBiometricPreference();
    }, []);

    const checkBiometryAvailability = async () => {
        const hasBiometrics = await LocalAuthentication.isEnrolledAsync();
        const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

        if (hasBiometrics) {
            if (supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FACE_ID)) {
                setBiometryType('Face ID');
            } else if (supportedBiometrics.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                setBiometryType('Fingerprint');
            }
            setBiometryEnabled(true);
        } else {
            setBiometryEnabled(false);
            Alert.alert("No Biometrics Found", "Please set up biometrics in your device settings.");
        }
    };

    const loadBiometricPreference = async () => {
        try {
            const value = await AsyncStorage.getItem('biometricEnabled');
            setBiometryEnabled(value === 'true');
        } catch (error) {
            console.error(error);
        }
    };

    const toggleBiometricPreference = async () => {
        const newValue = !biometryEnabled;
        setBiometryEnabled(newValue);
        await AsyncStorage.setItem('biometricEnabled', newValue.toString());
        Alert.alert(
            newValue ? "Biometric Enabled" : "Biometric Disabled",
            `You have ${newValue ? "enabled" : "disabled"} biometric authentication.`
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#EAF1FF' }]}>
            <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Biometric Authentication</Text>
            {biometryEnabled && (
                <View style={styles.switchContainer}>
                    <Text style={[styles.label, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Enable {biometryType}</Text>
                    <Switch
                        value={biometryEnabled}
                        onValueChange={toggleBiometricPreference}
                    />
                </View>
            )}
            {!biometryEnabled && (
                <Text style={[styles.message, { color: isDarkMode ? '#AAAAAA' : 'grey' }]}>
                    Please set up biometric authentication in your device settings.
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    label: {
        fontSize: 18,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default BiometricSetup;
