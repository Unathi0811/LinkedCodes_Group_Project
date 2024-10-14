import { StatusBar } from "expo-status-bar";
import { Slot,Tabs } from "expo-router";

const _layout = () => {
    return (
        <Tabs initialRouteName="home" 
        
        screenOptions={{
            headerShown: true,
        }}>
            <Tabs.Screen 
                name="home"
                
            />
            <Tabs.Screen 
                name="reporting"
            />
            <Tabs.Screen 
                name="traffic"
            />
        </Tabs>
    );
};

export default _layout;
