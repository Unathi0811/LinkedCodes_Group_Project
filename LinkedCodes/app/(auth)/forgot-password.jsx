// import React, { useState } from "react";
// import {
//     View,
//     TextInput,
//     StyleSheet,
//     TouchableOpacity,
//     Text,

// } from "react-native";
// import { sendPasswordResetEmail, getAuth } from "firebase/auth";
// import Icon from "react-native-vector-icons/Feather";
// import { Overlay } from "@rneui/themed";
// import { Link } from "expo-router";

// export default function ResetPassword({ navigation }) {
//     const [resetEmail, setResetEmail] = useState("");
//     const [visible, setVisible] = useState(false);
//     const [overlayMessage, setOverlayMessage] = useState("");

//     const handleForgotPassword = async () => {
//         if (resetEmail === "") {
//             setOverlayMessage("Please enter your email address.");
//             setVisible(true);
//             return;
//         }

//         try {
//             await sendPasswordResetEmail(getAuth(), resetEmail);
//             setOverlayMessage("Password reset email sent. Check your inbox.");
//             setVisible(true);
//             setResetEmail("");
//         } catch (error) {
//             if (error.code === "auth/user-not-found") {
//                 setOverlayMessage("No user found with this email.");
//             } else {
//                 setOverlayMessage(error.message);
//             }
//             setVisible(true);
//         }
//     };

//     return (
//         <View style={styles.mainView}>
//             <View style={styles.topContainer}>
//                 <Link href="/login" asChild>
//                     <TouchableOpacity>
//                         <Icon name="chevron-left" size={45} color="#202A44" />
//                     </TouchableOpacity>
//                 </Link>
//             </View>
//             <View style={styles.centerContainer}>
//                 <Text style={styles.heading}>Reset Password</Text>
//                 <View style={styles.formView}>
//                     <Text style={styles.inputHeading}>Email</Text>
//                     <TextInput
//                         style={styles.textInput}
//                         placeholder={"Email"}
//                         placeholderTextColor={"grey"}
//                         value={resetEmail}
//                         onChangeText={setResetEmail}
//                     />
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={handleForgotPassword}
//                     >
//                         <Text style={styles.buttonText}>Send Reset Email</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
           
//             <Overlay
//                 isVisible={visible}
//                 onBackdropPress={() => setVisible(false)}
//                 overlayStyle={styles.overlay}
//             >
//                 <View style={styles.overlayContent}>
//                     <Icon name="info" size={50} color="#000" style={styles.overlayIcon} />
//                     <Text style={styles.overlayText}>{overlayMessage}</Text>
//                 </View>
//             </Overlay>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     mainView: {
//         flex: 1,
//         backgroundColor: "#fff",
//     },
//     topContainer: {
//         paddingHorizontal: 20,
//         marginTop: 40,
//         alignItems: "flex-start",
//     },
//     heading: {
//         fontSize: 25,
//         fontWeight: "bold",
//         color: "#202A44",
//         textAlign: "center",
//         marginTop: 20, 
//     },
//     centerContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     formView: {
//         width: "80%",
//         alignItems: "center",
//         justifyContent: "center",
//         marginTop: 20, // Added space between the heading and form
//     },
//     inputHeading: {
//         color: "#202A44",
//         fontSize: 18,
//         alignSelf: "flex-start",
//         marginBottom: 20,
//     },
//     textInput: {
//         width: "100%",
//         height: 50,
//         borderColor: "#202A44",
//         borderWidth: 1,
//         borderRadius: 10,
//         paddingHorizontal: 10,
//         marginBottom: 20,

//     },
//     button: {
//         backgroundColor: "#202A44",
//         borderRadius: 10,
//         height: 50,
//         justifyContent: "center",
//         alignItems: "center",
//         width: "100%",
//         marginTop: 10,
//         shadowOffset: { width: 3, height: 10 },
//         shadowOpacity: 0.2,
//     },
//     buttonText: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#fff",
    
//     },
//     overlay: {
//         width: "80%",
//         height: 320,
//         borderRadius: 10,
//         padding: 20,
//         backgroundColor: "#EAF1FF",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     overlayContent: {
//         alignItems: "center",
//     },
//     overlayIcon: {
//         marginBottom: 15,
//     },
//     overlayText: {
//         fontSize: 16,
//         textAlign: "center",
//     },
// });
import React, { useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Text,
    ActivityIndicator,
} from "react-native";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/Feather";
import { Overlay } from "@rneui/themed";
import { Link } from "expo-router";

export default function ResetPassword({ navigation }) {
    const [resetEmail, setResetEmail] = useState("");
    const [visible, setVisible] = useState(false);
    const [overlayMessage, setOverlayMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (resetEmail === "") {
            setOverlayMessage("Please enter your email address.");
            setVisible(true);
            return;
        }

        setLoading(true);

        setTimeout(async () => {
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
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <View style={styles.mainView}>
            <View style={styles.topContainer}>
                <Link href="/login" asChild>
                    <TouchableOpacity>
                        <Icon name="chevron-left" size={45} color="#202A44" />
                    </TouchableOpacity>
                </Link>
            </View>
            <View style={styles.centerContainer}>
                <Text style={styles.heading}>Reset Password</Text>
                <View style={styles.formView}>
                    <Text style={styles.inputHeading}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder={"Email"}
                        placeholderTextColor={"grey"}
                        value={resetEmail}
                        onChangeText={setResetEmail}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleForgotPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}>Send Reset Email</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
           
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
    topContainer: {
        paddingHorizontal: 20,
        marginTop: 40,
        alignItems: "flex-start",
    },
    heading: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#202A44",
        textAlign: "center",
        marginTop: 20, 
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    formView: {
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20, 
    },
    inputHeading: {
        color: "#202A44",
        fontSize: 18,
        alignSelf: "flex-start",
        marginBottom: 20,
    },
    textInput: {
        width: "100%",
        height: 50,
        borderColor: "#202A44",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#202A44",
        borderRadius: 10,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 10,
        shadowOffset: { width: 3, height: 10 },
        shadowOpacity: 0.2,
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
});
