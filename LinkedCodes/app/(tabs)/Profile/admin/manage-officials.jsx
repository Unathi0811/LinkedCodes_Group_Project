import { doc, updateDoc } from "firebase/firestore";
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, Link } from "expo-router";
import {
	collection,
	getDocs,
	query,
	where,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import Octicons from "@expo/vector-icons/Octicons";
import { useUser } from "../../../../src/cxt/user";

const ManageOfficials = () => {
	const [users, setUsers] = useState([]);
	const { user } = useUser();
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const q = query(
			collection(db, "user"),
			where("deleted", "==", false),
			where("email", "!=", user.email)
		);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const users_ = [];
			querySnapshot.forEach((doc) => {
				users_.push({ ...doc.data(), id: doc.id });
			});
			setUsers(users_);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const handleBlock = async (id, state) => {
		const userDocRef = doc(db, "user", id);

		await updateDoc(userDocRef, {
			blocked: !state,
		});
	};
	const handleDelete = async (id) => {
		const userDocRef = doc(db, "user", id);

		await updateDoc(userDocRef, {
			deleted: true,
		});
	};

	const placeholderImage = "https://via.placeholder.com/60";

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: "Manage Officials",
					headerBackTitleVisible: false,
					headerTintColor: "#202A44",
					headerRight: () => (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 24,
							}}
						>
							<Link
								asChild
								href="/(tabs)/Profile/admin/add"
							>
								<Octicons
									name="person-add"
									size={24}
									color="black"
								/>
							</Link>
							<TouchableOpacity
								onPress={() => {
									/* Navigate to notifications screen */
								}}
							>
								<View style={{ position: "relative" }}>
									<Octicons
										name="bell"
										size={21}
										color="black"
									/>
									{notifications.length > 0 && (
										<View
											style={{
												position: "absolute",
												right: -5,
												top: -5,
												backgroundColor: "red",
												borderRadius: 10,
												padding: 5,
												minWidth: 20,
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Text
												style={{
													color: "white",
													fontSize: 12,
												}}
											>
												{notifications.length}
											</Text>
										</View>
									)}
								</View>
							</TouchableOpacity>
						</View>
					),
					contentStyle: {
						backgroundColor: "#F2f9FB",
					},
					// headerBackground() {
					// 	return (
					// 		<View
					// 			style={{ backgroundColor: "#F2f9FB", flex: 1 }}
					// 		/>
					// 	);
					// },
				}}
			/>
			<FlatList
				data={users}
				renderItem={({ item }) => (
					<View style={styles.card}>
						<View style={styles.profileContainer}>
							<Image
								source={{
									uri: item.profileImage || placeholderImage,
									cache: "force-cache",
								}}
								style={styles.profileImage}
							/>
							<View style={styles.textContainer}>
								<Text style={styles.title}>
									{item.username}
								</Text>
								<Text
									style={styles.description}
									numberOfLines={1}
								>
									{item.email}
								</Text>
							</View>
						</View>
						<View style={styles.buttonContainer}>
							<TouchableOpacity
								style={styles.button}
								onPress={() =>
									handleBlock(item.id, item.blocked)
								}
							>
								{item.blocked ? (
									<Octicons
										name="unlock"
										size={24}
										color="#202A44"
									/>
								) : (
									<Octicons
										name="lock"
										size={24}
										color="#202A44"
									/>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={() => handleDelete(item.id)}
							>
								<Octicons
									name="trash"
									size={24}
									color="#202A44"
								/>
							</TouchableOpacity>
						</View>
					</View>
				)}
				keyExtractor={(item) => item.id}
			/>
		</>
	);
};

export default ManageOfficials;

const styles = StyleSheet.create({
	card: {
		backgroundColor: "white",
		padding: 20,
		marginVertical: 10,
		marginHorizontal: 20,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	profileContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	profileImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginRight: 10,
	},
	textContainer: {},
	title: {
		fontSize: 18,
		color: "#202A44",
	},
	description: {
		fontSize: 14,
		width: 150,
		color: "#202A44",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 30,
	},
	button: {
		// padding: 15,
	},
});
