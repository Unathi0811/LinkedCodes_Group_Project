import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

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
            </View>

            {/* Scrollable content */}
            <ScrollView style={styles.content}>
                <Text style={styles.newsText}>News</Text>
                
                {/* News card */}
                <View style={styles.card}>
                    <Image source={require("../../assets/road.png")} style={styles.image} />
                    <Text style={styles.headline}>Headline</Text>
                </View>
                
                {/* Stop-and-go card */}
                <View style={styles.card}>
                    <Image source={require("../../assets/stop.png")} style={styles.image} />
                    <Text style={styles.headline}>Stop-and-go roads update</Text>
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1, // Full-screen layout
        backgroundColor: "#F2f9FB",
    },
    headerContainer: {
        position: "absolute", // Makes it fixed at the top
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        padding: 20,
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10, // Ensure it's on top of other content
        backgroundColor: "#F2f9FB", // Background to match the container
    },
    hamburgerButton: {
        padding: 10,
    },
    content: {
        marginTop: 80, // Add margin to push down content so it's not behind the header
        paddingHorizontal: 20,
    },
    newsText: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20,
        textAlign: "left",
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
});
