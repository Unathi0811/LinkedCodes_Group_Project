import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import ProfileScreen from './components/Profile.jsx';
import PersonalInformation from './components/PersonalInformation.jsx';
import DeleteAccount from './components/DeleteAccount.jsx';
import LogOut from './components/LogOut.jsx';
import Settings from './components/Settings.jsx';
import BiometricSettings from './components/Biometric.jsx';
import UserReviews from './components/UserReview.jsx';
import Notifications from './components/Notifications.jsx';
import EmergencyContact from './components/EmergencyContacts.jsx';
import SettingsButton from './components/settingsbutton.jsx';

const Stack = createStackNavigator();

const App = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    location: '',
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = isDarkMode ? DarkTheme : DefaultTheme;
  theme.colors = {
    ...theme.colors,
    primary: '#003366',
    background: isDarkMode ? '#000000' : '#E6F0FF',
    card: '#003366',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    border: '#003366',
    notification: '#003366',
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#202A44' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: null,
        }}
        initialRouteName="Profile"
      >
        <Stack.Screen name="Profile">
          {props => (
            <View style={{ flex: 1 }}>
              <ProfileScreen 
                {...props} 
                profileImage={profileImage} 
                profileData={profileData} 
                isDarkMode={isDarkMode} 
              />
              <SettingsButton 
                onToggleTheme={toggleTheme}
                style={{ position: 'absolute', bottom: 20, right: 20, width: 40, height: 40 }} 
              />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="PersonalInformation">
          {props => (
            <PersonalInformation
              {...props}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
              profileData={profileData}
              setProfileData={setProfileData}
              isDarkMode={isDarkMode} // Pass the dark mode state
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
        <Stack.Screen name="LogOut" component={LogOut} />
        <Stack.Screen name="BiometricSettings">
          {props => (
            <BiometricSettings 
              {...props} 
              isDarkMode={isDarkMode} 
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="UserReviews">
          {props => (
            <UserReviews 
              {...props} 
              isDarkMode={isDarkMode} 
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Notifications">
          {props => (
            <Notifications 
              {...props} 
              isDarkMode={isDarkMode} 
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {props => (
            <Settings 
              {...props} 
              toggleTheme={toggleTheme} 
              isDarkMode={isDarkMode} 
              profileImage={profileImage}
              profileData={profileData}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="EmergencyContacts">
          {props => (
            <EmergencyContact 
              {...props}
              isDarkMode={isDarkMode}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
