import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = () => {
    const handleMenuPress = () => {
        //what happens when the hamburger is pressed
        console.log("Hamburger menu pressed");
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                onPress={handleMenuPress}
                style={styles.hamburgerButton}
                >
                <Icon name="bars" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <Text style={styles.newsText}>News</Text>
                
            {/* another view for relevent news, with a pcture and a headlines under it */}
            <View>
                <Image source={require("../../assets/road.png")} style={styles.image} />
                <Text>Headline</Text>
            </View>
            {/* another view here with stop and go news/ maps showing where one should stop and go, and thea after the map it should displkay a headline of some sort */}
            <View>
                {/* or a map showing stop and go roads to stop and go at  */}
                <Image source={require("../../assets/stop.png")} style={styles.image} />
                <Text>Headline</Text>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    cointainer: {
        backgroundColor: "#F2f9FB",
    },
    headerContainer: {
        flexDirection: "row",
    },
    image:{
        width: "40%",
        height: 100,
        borderRadius: 20,
    }
});
