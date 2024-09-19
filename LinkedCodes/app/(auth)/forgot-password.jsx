import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    TouchableWithoutFeedback,
} from "react-native";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/Feather";
import { Overlay } from "@rneui/themed";
import { Link } from "expo-router";

export default function ResetPassword({ navigation }) {
    const [resetEmail, setResetEmail] = useState("");
    const [visible, setVisible] = useState(false);
    const [overlayMessage, setOverlayMessage] = useState("");

    const handleForgotPassword = async () => {
        if (resetEmail === "") {
        setOverlayMessage("Please enter your email address.");
        setVisible(true);
        return;
        }

        try {
        await sendPasswordResetEmail(getAuth(), resetEmail);
        setOverlayMessage("Password reset email sent. Check your inbox.");
        setVisible(true);
        setResetEmail("");
        } catch (error) {
        if (error.code === "auth/user-not-found") {
            setOverlayMessage("No user found with this email.");
        } else {
            setOverlayMessage(error.message);
        }
        setVisible(true);
        }
    };

    return (
        <View style={styles.mainView}>
            <View style={styles.imageContainer}>
                <Image source={require("../../assets/top.png")} style={styles.topImage} />
            </View>
        <View style={styles.bottomview}>
            <Text style={styles.Heading}>Reset Password</Text>
            <View style={styles.formView}>
            <Text style={styles.inputHeading}>Email</Text>
            <View style={styles.inputContainer}>
                <Icon
                name={"mail"}
                size={24}
                color={"#ccc"}
                style={styles.inputIcon}
                />
                <TextInput
                placeholder={"Email"}
                placeholderTextColor={"grey"}

                value={resetEmail}
                onChangeText={setResetEmail}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleForgotPassword}
            >
                <Text style={styles.buttonText}>Send Reset Email</Text>
            </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
                <Link href="/login" asChild>
                    <TouchableOpacity>
                        <View style={styles.icon}>
                            <Icon
                            style={styles.icon}
                            name="chevron-left"
                            size={45}
                            color="#202A44"
                            />
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
        <Image source={require("../../assets/right.png")} style={styles.rightImage} />
        <Overlay
            isVisible={visible}
            onBackdropPress={() => setVisible(false)}
            overlayStyle={styles.overlay}
        >
            <View style={styles.overlayContent}>
            <Icon name="info" size={50} color="#000" style={styles.overlayIcon} />
            <Text style={styles.overlayText}>{overlayMessage}</Text>
            </View>
        </Overlay>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    bottomview: {
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        padding: 30,
    },
    Heading: {
        color: "#202A44",
        fontSize: 25,
        marginRight: 30,
        fontWeight: "bold",
        marginTop: 89,
        textAlign: "center",
        marginBottom: -95,
    },
    formView: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 120,
    },
    text: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#202A44",
        height: 52,
        borderRadius: 10,
        marginTop: 10,
        paddingLeft: 5,
    },
    button: {
        backgroundColor: "#202A44",
        color: "#fff",
        flexDirection: "row",
        borderRadius: 20,
        marginHorizontal: 40,
        elevation: 10,
        marginVertical: 20,
        height: 50,
        width: "90%",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: { width: 3, height: 10 },
        shadowOpacity: 0.1,
        shadowColor: "#202A44",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    overlay: {
        width: "80%",
        height: 320,
        borderRadius: 10,
        padding: 20,
        backgroundColor: "#EAF1FF",
        alignItems: "center",
        justifyContent: "center",
    },
    overlayContent: {
        alignItems: "center",
    },
    overlayIcon: {
        marginBottom: 15,
    },
    overlayText: {
        fontSize: 16,
        textAlign: "center",
    },
    icon: {
        alignSelf: "flex-start",
        marginTop: "40%",
    },
    inputContainer: {
        backgroundColor: "#ffffff",
        flexDirection: "row",
        borderRadius: 20,
        marginHorizontal: 40,
        elevation: 10,
        marginVertical: 20,
        height: 50,
        width: "90%",
        alignItems: "center",
        shadowOffset: { width: 3, height: 10 },
        shadowOpacity: 0.8,
        shadowColor: "#202A44",
        gap: 10,  
        paddingHorizontal: 10,
    },
    inputHeading: {
        color: "#202A44",
        marginTop: 15,
        alignSelf: "flex-start",
        paddingLeft: 25,
    },
    topImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
        marginBottom: 0,
        marginLeft: -29,
        marginTop: 0,
      },
      bottomContainer:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      },
      rightImage: {
        width: 344,
        height: 140,
        resizeMode: 'cover',
        position: 'absolute',
        bottom: 0,
        right: 0,
      }
});
