import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router'; 

// function useNotificationObserver() {
//     useEffect(() => {
//       let isMounted = true;
  
//       function redirect(notification: Notifications.Notification) {
//         const url = notification.request.content.data?.url;
//         if (url) {
//           router.push(url);
//         }
//       }
  
//       Notifications.getLastNotificationResponseAsync()
//         .then(response => {
//           if (!isMounted || !response?.notification) {
//             return;
//           }
//           redirect(response?.notification);
//         });
  
//       const subscription = Notifications.addNotificationResponseReceivedListener(response => {
//         redirect(response.notification);
//       });
  
//       return () => {
//         isMounted = false;
//         subscription.remove();
//       };
//     }, []);
//   }

const _layout = () => {
    return (
        <>
            {/* useNotificationObserver(); */}
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false}} />
        </>
    )
}

export default _layout

const styles = StyleSheet.create({})