// app/_layout.js
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { NavigationContainer } from '@react-navigation/native';

export default function Layout() {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="index" options={{ drawerLabel: "Home" }} />
                <Drawer.Screen name="profile" options={{ drawerLabel: "Profile" }} />
                <Drawer.Screen name="personalInformation" options={{ drawerLabel: "Personal Info" }} />
                <Drawer.Screen name="settings" />
                <Drawer.Screen name="deleteAccount" options={{ drawerLabel: "Delete Account" }} />
                <Drawer.Screen name="userReviews" options={{ drawerLabel: "User Reviews" }} />
                <Drawer.Screen name="notifications" />
                <Drawer.Screen name="messages" />
                <Drawer.Screen name="reports" />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
