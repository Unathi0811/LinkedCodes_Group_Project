import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../../firebase";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ActivityIndicator,
	StyleSheet,
	FlatList,
} from "react-native";
import { Stack } from "expo-router";

const AdminAuditLogs = () => {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLogs = async () => {
			setLoading(true);
			try {
				const q = query(
					collection(db, "audit_log"),
					orderBy("timestamp", "desc")
				);
				const snapshot = await getDocs(q);
				const fetchedLogs = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setLogs(fetchedLogs);
			} catch (error) {
				console.error("Error fetching audit logs: ", error);
				setError("Failed to load logs");
			} finally {
				setLoading(false);
			}
		};
		fetchLogs();
	}, []);

	if (loading) {
		return (
			<View style={styles.centered}>
				<Stack.Screen
					options={{
						headerTitle: "Audit Log",
						headerTintColor: "#202A44",
					}}
				/>
				<ActivityIndicator
					size="large"
					color="#202A44"
				/>
				<Text>Loading logs...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.centered}>
				<Stack.Screen
					options={{
						headerTitle: "Audit Log",
						headerTintColor: "#202A44",
					}}
				/>
				<Text style={styles.errorText}>{error}</Text>
			</View>
		);
	}

	const renderItem = ({ item }) => (
		<View style={styles.card}>
			<View style={styles.logEntry}>
				<Text style={styles.label}>Timestamp:</Text>
				<Text style={styles.value}>
					{new Date(item.timestamp).toLocaleString()}
				</Text>
			</View>
			<View style={styles.logEntry}>
				<Text style={styles.label}>User Email:</Text>
				<Text style={styles.value}>{item.userEmail}</Text>
			</View>
			<View style={styles.logEntry}>
				<Text style={styles.label}>Action Type:</Text>
				<Text style={styles.value}>{item.actionType}</Text>
			</View>
			<View style={styles.logEntry}>
				<Text style={styles.label}>Target ID:</Text>
				<Text style={styles.value}>{item.targetId}</Text>
			</View>
			<View style={styles.logEntry}>
				<Text style={styles.label}>Status:</Text>
				<Text style={styles.value}>{item.status}</Text>
			</View>
			<View style={styles.logEntry}>
				<Text style={styles.label}>Changes Made:</Text>
				<Text style={styles.value}>
					{JSON.stringify(item.changesMade)}
				</Text>
			</View>
		</View>
	);

	return (
		<View
			style={{
				backgroundColor: "#F2f9FB",
			}}
		>
			<Stack.Screen
				options={{
					headerTitle: "Audit Log",
					headerTintColor: "#202A44",
				}}
			/>
			<FlatList
				data={logs}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.listContainer}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 8,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#202A44",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4,
		elevation: 3,
		width: "100%",
	},
	logEntry: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 8,
	},
	label: {
		fontWeight: "bold",
		color: "#202A44",
	},
	value: {
		color: "#ccc",
	},
	errorText: {
		color: "red",
	},
	listContainer: {
		paddingBottom: 16,
		padding: 10,
		backgroundColor: "#F2f9FB",
	},
});

export default AdminAuditLogs;

//idea below
//STEP1
// Whenever a user-related action occurs (create(signUp, Login) , update(userprofile), delete(delete account, reports, deleting users by admin)),
//you should call a function that writes an entry to the audit log.
//first import firestore, collection, and try create a context and more
//my function idea below:
// const logAudit = async (UserID, Action, TargetUserID, TargetResource, ActionDetails) => {
//     const logEntry = {
//       Timestamp: new Date().toISOString(),
//       UserID,
//       Action,
//       TargetUserID,
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
