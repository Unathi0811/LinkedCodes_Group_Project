import React from 'react';
import { StyleSheet, Text, View, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//IN PROGRESS
const HomeScreen = () => {
    const navigation = useNavigation();
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.appName}>InfraSmart</Text>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.profileButtonText}>Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Real-Time Monitoring</Text>
                {/* Add a map or list component here */}
                <Image source={require('../../../assets/maintenance.png')} style={styles.sectionImage} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Predictive Maintenance</Text>
                {/* Add a chart or list of tasks */}
                <Image source={require('../../../assets/maintenance.png')} style={styles.sectionImage} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Incident Reporting</Text>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ReportIncident')}>
                    <Text style={styles.actionButtonText}>Report an Incident</Text>
                </TouchableOpacity>
                <Image source={require('../../../assets/reporting.png')} style={styles.sectionImage} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Analytics Dashboard</Text>
                {/* Add analytics components or links */}
                <Image source={require('../../../assets/analytics.png')} style={styles.sectionImage} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    profileButton: {
        padding: 10,
        backgroundColor: '#E5C200',
        borderRadius: 5,
    },
    profileButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    actionButton: {
        padding: 15,
        backgroundColor: '#E5C200',
        borderRadius: 5,
        marginBottom: 10,
    },
    actionButtonText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default HomeScreen;
