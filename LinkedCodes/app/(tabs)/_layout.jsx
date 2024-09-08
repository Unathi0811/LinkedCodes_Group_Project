import React from "react";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs screenOptions={{ headerShown: !false }} initialRouteName="Maintain">
      <Tabs.Screen name="Mantain" />
      <Tabs.Screen name="RateUs" />
      <Tabs.Screen name="Profile" />
      <Tabs.Screen name="Settings" />
    </Tabs>
  );
};

export default _layout;
