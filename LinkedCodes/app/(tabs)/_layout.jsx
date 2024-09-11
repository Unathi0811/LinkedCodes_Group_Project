import React from "react";
import { Tabs } from "expo-router";
import Home from "./Home";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const _layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName='Home' >
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="RateUs"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline"color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user-circle" color={color} size={size} stroke={0.9} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
