import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Gov_User_screen from "./screens/Gov_User_screen";
import LoginScreen from "./screens/LoginScreen";


const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="Gov_User_screen"
            >
                <Stack.Screen name="Gov_User_screen" component={Gov_User_screen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

const styles = StyleSheet.create({});
