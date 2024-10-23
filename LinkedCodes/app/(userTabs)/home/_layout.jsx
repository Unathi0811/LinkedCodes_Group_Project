import { StatusBar } from "expo-status-bar";
import { Stack, Tabs } from "expo-router";
import { View } from "react-native";

const Layout = () => {
  return (
    <>
      <Tabs.Screen
        options={{
          tabBarVisibilityAnimationConfig: {
            hide: {
              animation: "spring",
            },
          },
          tabBarHideOnKeyboard: true,
        }}
      />
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
        //   headerBackground: () => (
        //     <View
        //       style={{
        //         backgroundColor: "red",
        //         flexGrow: 1,
        //       }}
        //     />
        //   ),
    
        }}
      />
    </>
  );
};

export default Layout;
