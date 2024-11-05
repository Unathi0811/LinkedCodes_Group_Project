import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const Layout = () => {
	return (
		<Tabs
			initialRouteName="home"
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#202A44",
				tabBarInactiveTintColor: "gray",
				tabBarStyle: {
					display: "flex",
					backgroundColor: "white",
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons
							name="home"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="reporting"
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons
							name="add-circle-outline"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="traffic"
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons
							name="traffic"
							size={size}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialIcons
							name="settings"
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
};

export default Layout;
