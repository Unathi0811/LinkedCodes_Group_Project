import { StatusBar } from "expo-status-bar";
import { Slot,Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const _layout = () => {
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
                      <Ionicons name="home-outline" color={color} size={size} />
                    ),
                  }}
            />
            <Tabs.Screen 
                name="reporting"
                options={{
                    tabBarIcon: ({ color  }) => (
                      <Ionicons name="clipboard-outline" color={color} size={34} />
                    ),
                  }}
            />
            <Tabs.Screen 
                name="traffic"
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <FontAwesome6
                        name="map"
                        color={color}
                        size={size}
                        stroke={0.9}
                      />
                    ),
                  }}
            />
        </Tabs>
    );
};

export default _layout;
