import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const Layout = () => {
  return (
    <Tabs initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#202A44',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: 'white',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reporting"
        options={{
          tabBarIcon: ({ color }) => (
          <MaterialIcons name="add-circle-outline" size={30} color={color} />
            // <Ionicons name="clipboard-outline" color={color} size={28} />
          ),
        }}
        />
      <Tabs.Screen
        name="traffic"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="traffic" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;