import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, router } from "expo-router";

const Home = () => {
    const handleMenuPress = () => {
        console.log("Hamburger menu pressed");
    };

    return (
        <View style={styles.container}>
        {/* Fixed header with hamburger button */}
        <View style={styles.headerContainer}>
            <TouchableOpacity
            onPress={handleMenuPress}
            style={styles.hamburgerButton}
            >
            <Icon name="bars" size={24} color="#202A44" />
            </TouchableOpacity>
            <Text style={styles.appName}>InfraSmart</Text>
        </View>

        {/* Scrollable content */}
        <ScrollView style={styles.content}>
            <Text style={styles.overviewText}>Overview</Text>

            <Link style={styles.manageButton} asChild href="/(tabs)/Maintainance/reporting">
            <TouchableOpacity style={styles.manageButton}>
                <Text style={styles.manageButtonText}>Manage Reports</Text>
            </TouchableOpacity>
            </Link>

            {/* Upcoming Maintenance Button */}
            <Link style={styles.upcomingButton} asChild href="/(tabs)/Maintainance/maintain">
            <TouchableOpacity style={styles.upcomingButton}>
                <Text style={styles.upcomingButtonText}>Upcoming Maintenance</Text>
            </TouchableOpacity>
            </Link>

            {/* Recent Updates Section */}
            <Text style={styles.recentUpdatesTitle}>Recent Updates</Text>
            <View style={styles.card}>
            <Image
                source={require("../../assets/road.png")}
                style={styles.image}
            />
            <Text style={styles.headline}>Pothole Repair Completed</Text>
            </View>
            <View style={styles.card}>
            <Image
                source={require("../../assets/bridge.png")}
                style={styles.image}
            />
            <Text style={styles.headline}>Bridge Inspection Scheduled</Text>
            </View>

            <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Updates</Text>
            </TouchableOpacity>

            <View style={styles.educationalSection}>
            <Text style={styles.educationalText}>
                Learn about the latest maintenance practices and reporting tools.
            </Text>
            <Image
                source={require("../../assets/road.png")}
                style={styles.educationalIcon}
            />
            </View>
        </ScrollView>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2f9FB",
    },
    headerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        padding: 20,
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
        backgroundColor: "#F2f9FB",
    },
    hamburgerButton: {
        padding: 10,
    },
    appName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#202A44",
    },
    content: {
        marginTop: 80,
        paddingHorizontal: 20,
    },
    overviewText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20,
        color: "#202A44",
    },
    manageButton: {
        backgroundColor: "#202A44",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        marginBottom: 10,
    },
    manageButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    upcomingButton: {
        backgroundColor: "#202A44",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        marginBottom: 20,
    },
    upcomingButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    recentUpdatesTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginVertical: 10,
        color: "#202A44",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        padding: 15,
        marginVertical: 10,
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    headline: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "#202A44",
    },
    viewAllButton: {
        alignItems: "center",
        marginVertical: 10,
    },
    viewAllText: {
        color: "#202A44",
        fontSize: 16,
        fontWeight: "bold",
    },
    educationalSection: {
        backgroundColor: "#E8F4F8",
        borderRadius: 10,
        padding: 15,
        marginVertical: 20,
        alignItems: "center",
        flexDirection: "row",
    },
    educationalText: {
        fontSize: 16,
        color: "#202A44",
        flex: 1,
    },
    educationalIcon: {
        width: 30,
        height: 30,
        marginLeft: 10,
    },
});
