import { collection, getDocs } from "firebase/firestore"; 
import { db } from '../../../../firebase';
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'audit_log'));
                const fetchedLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLogs(fetchedLogs);
            } catch (error) {
                console.error("Error fetching audit logs: ", error);
            }
        };
        fetchLogs();
    }, []);

    return (
        <View>
            {logs.map(log => (
                <Text key={log.id}>{`${log.timestamp}: ${log.action} by ${log.userId}`}</Text>
            ))}
        </View>
    );
};

export default AdminAuditLogs;

//idea below

//STEP1
// Whenever a user-related action occurs (create(signUp, Login) , update(userprofile), delete(delete account, reports, deleting users by admin)), 
//you should call a function that writes an entry to the audit log. 
//first import firestore, collection, and try create a context and more
//my function idea below:
// const logAudit = async (userId, action, targetUserId, ActionDetails) => {
//     const logEntry = {
//       timestamp: new Date().toISOString(),
//       userId,
//       action,
//       targetUserId,
//       ActionDetails,
//     };

//     try {
//       await firestore.collection('audit_logs').add(logEntry);
//       console.log("Audit log entry created");
//     } catch (error) {
//       console.error("Error writing audit log: ", error);
//     }
//   };

//Step2
// Create a context to store the audit log entries. This will allow you to access the audit log
// from the admin component in the app. 

//STEP3
// Integrate Logging into User Management Functions
// In user management codes (e.g., when creating or deleting a user and more), call the logAudit function.
//  For example these functions in the app:
// const createUser = async (userData) => {
//     // Code to create user
//     await logAudit(currentUserId, 'create', newUserId, JSON.stringify(userData));
//   };
//   const deleteUser = async (userIdToDelete) => {
//     // Code to delete user
//     await logAudit(currentUserId, 'delete', userIdToDelete, 'User deleted');
//   };

// 5. Monitor and Query Logs
// You may want to create an interface in your admin panel to view these logs. Firestore allows you to query the audit_logs collection, so you can filter by user ID, action type, or date range.

// 6. Consider Data Retention Policies
// Depending on your app’s needs, consider how long you want to retain audit logs. You might implement a strategy to delete logs older than a certain period to manage storage.

// 7. Implement Security Rules
// Make sure to secure your audit_logs collection. Only authorized users (like admins) should be able to read these logs. Update your Firestore security rules accordingly.

// Example Firestore Security Rule
// javascript
// Copy code
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /audit_logs/{logId} {
//       allow read: if request.auth != null && request.auth.token.role == 'admin'; // Ensure only admins can read logs
//       allow write: if false; // Prevent direct writes to the log
//     }
//   }
// }
// 8. Test Your Implementation
// Finally, ensure to thoroughly test your logging mechanism to confirm that all necessary changes are accurately recorded in the audit log.