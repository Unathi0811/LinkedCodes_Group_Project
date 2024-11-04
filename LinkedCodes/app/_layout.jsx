import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { UserProvider } from "../src/cxt/user";
import { ReportProvider } from "../src/cxt/reports";
import ReactNativeInactivity from "react-native-inactivity";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Alert } from "react-native";
import { AuditContextProvider } from "../src/cxt/audit";
import { PaymentProvider } from "../src/cxt/pay";

const Layout = () => {
  const [inactivityTimeoutCount, setInactivityTimeoutCount] = useState(0);
  const [isActive, setIsActive] = useState(true); 
  const [loop] = useState(true);

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
            })
            .catch((error) => {
              console.log("Error logging out: ", error);
            });
        },
      },
    ]);
  };

  return (
    <ReactNativeInactivity
      isActive={isActive}
      onInactive={() => {
        setInactivityTimeoutCount(inactivityTimeoutCount + 1);
        handleInactivity(); 
      }}
      timeForInactivity={800000} // 60000 is 1 minute, u30 miuntes ngu 1800000
      restartTimerOnActivityAfterExpiration={false}
      loop={loop}
    >
    <PaymentProvider>
    <AuditContextProvider>
      <ReportProvider>
        <UserProvider>
          <StatusBar style="dark" />
          <Slot />
        </UserProvider>
      </ReportProvider>
      </AuditContextProvider>
      </PaymentProvider>
    </ReactNativeInactivity>
  );
};

export default Layout;
