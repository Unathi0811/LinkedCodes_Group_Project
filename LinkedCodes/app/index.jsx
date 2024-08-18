import React from 'react';  
import { NavigationContainer } from '@react-navigation/native';  
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
//intro screens 
import SplashScreen from './intro-screens/SplashScreen';
import OnBoardingScreen_1 from './intro-screens/OnBoarding_1';
import OnBoardingScreen_2 from './intro-screens/OnBoarding_2';
//main screens 
import HomePage from './main-screens/HomePage';
import Profile from './main-screens/Profile';
import Settings from './main-screens/Settings';

const Tabs = createBottomTabNavigator();
const Stacks = createNativeStackNavigator(); 

const TabsBottom = () => {
  return(
    // for now 
      <Tabs.Navigator initialRouteName='HomePage'
        screenOptions= {{
          tabBarStyle: {
            fontSize:40,
            fontWieght:'bold'
          },
          headerShown: false,
      }}>
        <Tabs.Screen name='Home' component={HomePage} />
        <Tabs.Screen name='Profile' component={Profile}/>
        <Tabs.Screen name='Settings' component={Settings}/>
      </Tabs.Navigator>
    
  )
}

function SatckNavigation () {  
  return (  
    
      <Stacks.Navigator initialRouteName="Splash" 
      screenOptions={{
        headerShown: false
      }}>  
        <Stacks.Screen name="Splash" component={SplashScreen} />  
        <Stacks.Screen name="OnBoardingScreen_1" component={OnBoardingScreen_1} />  
        <Stacks.Screen name="OnBoardingScreen_2" component={OnBoardingScreen_2} /> 
        <Stacks.Screen name='HomePage' component={TabsBottom}/> 
      </Stacks.Navigator>  
     
  );  
};  
export default SatckNavigation

// export default Index =() => {
//   return(
//     <NavigationContainer>
//       <TabsBottom/>
//     </NavigationContainer>
//   )
// }
