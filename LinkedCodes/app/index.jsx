import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreens from "./OnboardingScreens";
import Gov_User_screen from "./home/screens/Gov_User_screen";
import LoginScreen from "./home/screens/LoginScreen";

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName="OnboardingScreens"
            >
                <Stack.Screen name="OnboardingScreens" component={OnboardingScreens} />
                <Stack.Screen name="Gov_User_screen" component={Gov_User_screen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

const styles = StyleSheet.create({});
