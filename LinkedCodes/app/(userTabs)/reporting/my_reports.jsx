import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const HistoricalReportsScreen = () => {
    const route = useRouter(); 
    const { reports, deleteReport } = route.params || {};

    if (!reports || !deleteReport) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No Reports Available</Text>
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity>
            <View style={styles.reportItem}>
                <Image source={{ uri: item.image }} style={styles.imageThumbnail} />
                <View style={styles.textContainer}>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.timestamp}>{item.timestamp.toDate().toLocaleString()}</Text>
                    <Text style={styles.urgency}>Urgency: {item.urgency}</Text>
                    <Text style={styles.urgency}>Category: {item.category}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteReport(item.id, item.image, item.userId)}>
                    <Icon name="trash" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Historical Reports</Text>
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F2f9FB',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#202A44',
    },
    reportItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        elevation: 5,
    },
    imageThumbnail: {
        width: 100,
        height: 100,
        borderRadius: 30,
    },
    textContainer: {
        flex: 1,
        paddingLeft: 10,
    },
    description: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
    },
    urgency: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default HistoricalReportsScreen;