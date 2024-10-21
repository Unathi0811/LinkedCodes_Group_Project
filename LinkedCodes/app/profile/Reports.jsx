
// app/Reports.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Reports = ({ isDarkMode }) => {
    const router = useRouter();
    const reportsData = []; // No reports available, add sample data if needed

    const renderItem = ({ item }) => (
        <View style={[styles.reportContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.reportTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{item.title}</Text>
            <Text style={[styles.reportDate, { color: isDarkMode ? '#ccc' : '#888' }]}>{item.date}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#202A44' : '#EAF1FF' }]}>
            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>Reports</Text>
            {reportsData.length === 0 ? (
                <Text style={[styles.noReportsText, { color: isDarkMode ? '#ccc' : '#888' }]}>No reports available</Text>
            ) : (
                <FlatList 
                    data={reportsData} 
                    renderItem={renderItem} 
                    keyExtractor={(item) => item.id} 
                />
            )}
        
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Back to Settings</Text>
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
    reportContainer: {
        marginVertical: 8,
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    reportTitle: {
        fontWeight: 'bold',
    },
    reportDate: {
        marginTop: 4,
    },
    noReportsText: {
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

export default Reports;
 