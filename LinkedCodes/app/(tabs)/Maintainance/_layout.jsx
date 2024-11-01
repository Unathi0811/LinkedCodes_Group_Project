import React from "react";
import { Stack } from "expo-router";

const Layout = () => (
	<Stack
		screenOptions={{ headerShown: false }}
		initialRouteName="index"
	/>
);

export default Layout;
