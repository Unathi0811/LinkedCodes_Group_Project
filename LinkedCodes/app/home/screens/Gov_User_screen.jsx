import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";

const Gov_User_screen = ({ navigation }) => {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.topImageContainer}>
                    <Image
                        source={require("../../../assets/Vector_1.png")}
                        style={styles.topImage}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Text style={styles.buttonText}>Government</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>User</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.leftVectorContainer}>
                    <Image 
                        source={require("../../../assets/Vector_2.png")}
                        style={styles.leftImage}
                    />
                </View>
            </View>
        </>
    );
};

export default Gov_User_screen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        position: "relative",
    },
    topImageContainer: {
        height: 50,
    },
    topImage: {
        width: "100%",
        height: 150,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',  
        alignItems: 'center',    
    },
    button: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        height: 50,
        width: '80%',
        justifyContent: "center",
        alignItems: "center",
        shadowOffset: { width: 3, height: 10 },
        shadowOpacity: 0.1,
        shadowColor: "#000",
        marginBottom: 30,  
    },
    buttonText: {
        textAlign: "center",
        color: "#3A5CAD",
        fontSize: 16,
    },
    leftVectorContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    leftImage: {
        width: 110,
        height: 300, 
    },
});
