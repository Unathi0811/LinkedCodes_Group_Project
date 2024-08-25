import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

const styles = StyleSheet.create({});

// import { StatusBar } from "expo-status-bar";
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     TextInput,
//     Platform,
//     Image,
// } from "react-native";
// import { Link } from "expo-router";

// export default function App() {
//     return (
//         <View style={styles.container}>
//             <View>
//                 <Image source={require("../assets/logo.png")} style={styles.image} />
//             </View>
//             <Link

//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: Platform.OS === "ios" ? 26 : 30,
//         gap: 20,
//         marginBottom: 119,
//     },
//     inputContainer: {
//         width: "100%",
//         gap: 5,
//     },
//     input: {
//         borderRadius: 20,
//         borderColor: "#ccc",
//         borderWidth: 1,
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//     },
//     button: {
//         backgroundColor: "pink",
//         padding: 10,
//         borderRadius: 30,
//     },
//     buttonText: {
//         fontSize: 15,
//         color: "#fff",
//         textTransform: "uppercase",
//         textAlign: "center",
//     },
//     image: {
//         marginLeft: 99,
//         marginBottom: 23,
//     },
// });

// {/* <View style={styles.inputContainer}>
// <Text>Email: </Text>
// <TextInput
// keyboardType="email-address"
// placeholder="Enter your email"
// textContentType="emailAddress"
// style={styles.input}
// />
// </View>
// <View style={styles.inputContainer}>
// <Text>Password: </Text>
// <TextInput
// keyboardType="default"
// placeholder="Enter your password"
// textContentType="password"
// style={styles.input}
// secureTextEntry
// />
// {/* <Link route="login" style={styles.button} href={""}>
// <Text>Forgot your password?</Text>
// </Link> */}
// // </View>

// // <View style={styles.inputContainer}>
// // <TouchableOpacity style={styles.button} activeOpacity={0.8}>
// // <Text style={styles.buttonText}>Login</Text>
// // </TouchableOpacity>
// // </View> */}
