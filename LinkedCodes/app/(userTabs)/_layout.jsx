import { StatusBar } from "expo-status-bar";
import { Slot,Tabs } from "expo-router";

const _layout = () => {
    return (
        <Tabs initialRouteName="home" screenOptions={{headerShown:false}}>
            <Tabs.Screen 
                name="home"
                
            />
            <Tabs.Screen 
                name="reporting"
            />
            <Tabs.Screen 
                name="traffic"
            />
             <Tabs.Screen 
                name="userChat"
            />
             <Tabs.Screen 
                name="Profile"
            />
        </Tabs>
    );
};

export default _layout;
