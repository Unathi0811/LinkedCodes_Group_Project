import { StyleSheet, Text, View, Image, TextInput, Button } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";

const LoginScreen = () => {
    return (
        <View style={styles.container}>
        <View style={styles.topImageContainer}>
            <Image
            source={require("../../assets/Vector1.png")}
            style={styles.topImage}
            />
        </View>

        <View style={styles.helloContainer}>
            <Text style={styles.hello}>Hello</Text>
        </View>

        <View>
            <Text style={styles.loginText}>Sign in to your account</Text>
        </View>

        <View style={styles.inputContainer}>
            <Icon name={"user"} size={24} color={"#ccc"} style={styles.inputIcon} />
            <TextInput style={styles.textInput} placeholder="Email" />
        </View>

        <View style={styles.inputContainer}>
            <Icon name={"lock"} size={24} color={"#ccc"} style={styles.inputIcon} />
            <TextInput
            style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            />
        </View>

        <Text style={styles.forgotPasswordText}>Forgot your password</Text>

        <View style={styles.signInButtonconatiner}>
            {/* <Button title="Sign in" color="#ccc" style={styles.signInButton} /> */}
            <Text style={styles.signIn}>Sign in</Text>
        </View>

        <LinearGradient
            colors={["#4c669f", "#3b5998", "#192f6a"]}
            style={styles.linearGradient}
        >
            <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </LinearGradient>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        color: "#F5F5F5",
    },
    topImageContainer: {
        height: 50,
    },
    topImage: {
        width: "100%",
        height: 130,
    },
    helloContainer: {
        marginTop: 79,
    },
    hello: {
        textAlign: "center",
        fontSize: 50,
        fontWeight: "400",
        color: "#262626",
    },
    loginText: {
        textAlign: "center",
        fontSize: 18,
        color: "#262626",
        fontWeight: "200",
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        borderRadius: 20,
        marginHorizontal: 40,
        elevation: 10,
        marginVertical: 20,
        height: 50,
        alignItems: "center",
        shadowOffset: { width: 3, height: 10 },
        shadowOpacity: 0.1,
        shadowColor: "#000",
    },
    textInput: {
        flex: 1,
    },
    inputIcon: {
        marginLeft: 10,
        marginRight: 5,
    },
    forgotPasswordText: {
        color: "#BEBEBE",
        textAlign: "right",
        fontSize: 15,
        width: "87%",
    },
    signInButtonconatiner: {},
    signIn: {
        color: "#262626",
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 30,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});
