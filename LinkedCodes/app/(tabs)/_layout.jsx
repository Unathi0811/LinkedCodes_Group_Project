import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#202A44',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: 'white',
        },
      }}
      initialRouteName='Home'
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Maintainance"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="cog-outline" color={color} size={34} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6
              name="user-circle"
              color={color}
              size={size}
              stroke={0.9}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" color={color} size={30} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
