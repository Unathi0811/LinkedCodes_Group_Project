import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

const NotificationsScreen = ({ isDarkMode }) => {
    const router = useRouter(); // Create router instance

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#202A44' : '#F0F4F8' }]}>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#202A44' }]}>Notifications</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: isDarkMode ? '#333' : '#202A44' }]}
                onPress={() => router.push('/(userTabs)/home/notifications/Messages')} // Use router.push for navigation
            >
                <Text style={styles.buttonText}>Go to Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: isDarkMode ? '#333' : '#202A44' }]}
                onPress={() => router.push('/(userTabs)/reporting')} // Use router.push for navigation
            >
                <Text style={styles.buttonText}>Go to Reports</Text>
            </TouchableOpacity>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    button: {
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default NotificationsScreen;
 