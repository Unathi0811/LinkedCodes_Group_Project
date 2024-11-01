import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

const Messages = ({ isDarkMode }) => {
    const messagesData = []; // No messages available
    const router = useRouter(); // Create router instance

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.sender, { color: isDarkMode ? '#fff' : '#000' }]}>{item.sender}:</Text>
            <Text style={[styles.message, { color: isDarkMode ? '#ccc' : '#000' }]}>{item.message}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#202A44' : '#EAF1FF' }]}>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Messages</Text>
            {messagesData.length === 0 ? (
                <Text style={[styles.noMessagesText, { color: isDarkMode ? '#ccc' : '#888' }]}>No messages available</Text>
            ) : (
                <FlatList data={messagesData} renderItem={renderItem} keyExtractor={(item) => item.id} />
            )}
            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/Notifications')}> 
                <Text style={styles.backButtonText}>Back to Notifications</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between', // Adjusts the layout to push the back button to the bottom
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    messageContainer: {
        marginVertical: 8,
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    sender: {
        fontWeight: 'bold',
    },
    message: {
        marginTop: 4,
    },
    noMessagesText: {
        textAlign: 'center',
        marginTop: 20,
    },
    backButton: {
        backgroundColor: '#202A44',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center', // Centers the button
        marginTop: 20, // Adds space above the button
    },
    backButtonText: {
        color: '#FFFFFF',
    },
});

export default Messages;
