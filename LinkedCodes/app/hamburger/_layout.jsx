/*import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from './settings';
import NotificationScreen from './notifications';
import EmergencyContactsScreen from './emergency';
import index from './index';
import RateUs from './rateUs';
import PersonalInformation from './PersonalInformation';
import BiometricSetup from './Biometric';
import logout from './logout';
import Delete from './Delete';

const Drawer = createDrawerNavigator();

export default function LayoutDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={index} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationScreen} />
      <Drawer.Screen name="Emergency" component={EmergencyContactsScreen} />
      <Drawer.Screen name="Rate Us" component={RateUs} />
      <Drawer.Screen name="Logout" component={logout} />
     
    </Drawer.Navigator>
  );
}*/


import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from './settings';
import NotificationScreen from './notifications';
import EmergencyContactsScreen from './emergency';
import Index from './index';
import RateUs from './rateUs';
import PersonalInformation from './PersonalInformation'; // Imported
import BiometricSetup from './Biometric'; // Imported


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator for additional screens
function AdditionalScreens() {
  return (
    <Stack>
      <Stack.Screen name="PersonalInformation" component={PersonalInformation} />
      <Stack.Screen name="Biometric" component={PersonalInformation} />
      <Stack.Screen name="Delete" component={PersonalInformation} />
      <Stack.Screen name="emergency" component={PersonalInformation} />
      <Stack.Screen name="notifications" component={PersonalInformation} />
      <Stack.Screen name="notifications" component={PersonalInformation} />
      <Stack.Screen name="notifications" component={PersonalInformation} />
      <Stack.Screen name="notifications" component={PersonalInformation} />
    </Stack>
  );
}

export default function LayoutDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={Index} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Notifications" component={NotificationScreen} />
      <Drawer.Screen name="Emergency Contacts" component={EmergencyContactsScreen} />
      <Drawer.Screen name="Rate Us" component={RateUs} />

    </Drawer.Navigator>
  );
}
