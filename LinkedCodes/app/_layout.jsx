import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { UserProvider } from "../src/cxt/user";
import { ReportProvider } from "../src/cxt/reports";
import ReactNativeInactivity from "react-native-inactivity";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Alert } from "react-native";
import { ThemeProvider } from "../src/cxt/theme";
import { AuditContextProvider } from "../src/cxt/audit";
const Layout = () => {
  const [inactivityTimeoutCount, setInactivityTimeoutCount] = useState(0);
  const [isActive, setIsActive] = useState(true); // To manage activity state
  const [loop] = useState(true);

  // Function to request permissions for notifications
  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Notification permission not granted');
      }
    }
  };

  // Function to schedule a local notification
  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Session Ended",
        body: "You have been logged out due to inactivity.",
      },
      trigger: null, // Triggers immediately
    });
  };

  // What to do when user is inactive
  const handleInactivity = () => {
    Alert.alert("Session Ended!", "Logging out...", [
      {
        text: "OK",
        onPress: () => {
          console.log("User inactive, logging out...") 
          signOut(auth)
            .then(() => {
              console.log("User logged out");
              scheduleNotification(); // Schedule notification on logout
            })
            .catch((error) => {
              console.log("Error logging out: ", error);
            });
        },
      },
    ]);
  };

  useEffect(() => {
    requestNotificationPermissions(); // Request permissions on component mount
  }, []);

  return (
    <ReactNativeInactivity
      isActive={isActive}
      onInactive={() => {
        setInactivityTimeoutCount(inactivityTimeoutCount + 1);
        handleInactivity(); 
      }}
      timeForInactivity={1300000} // 30 minutes
      restartTimerOnActivityAfterExpiration={false}
      loop={loop}
    >
      {/* theme provider here, for the theme */}
    <ThemeProvider>
    <AuditContextProvider>
      <ReportProvider>
        <UserProvider>
          <StatusBar style="dark" />
          <Slot />
        </UserProvider>
      </ReportProvider>
      </AuditContextProvider>
    </ThemeProvider>
    </ReactNativeInactivity>
  );
};

export default Layout;
