import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
	ScrollView,
	Dimensions,
} from "react-native";
import { useUser } from "../../../../src/cxt/user";
import { Link, Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { FlatGrid } from "react-native-super-grid";
import { db } from "../../../../firebase";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

const HomeScreen = () => {
	const { user } = useUser();

	if (!user) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>
					No user found. Please log in.
				</Text>
			</View>
		);
	}

	// grid items, a usestate with all items in it
	const [items, setItems] = useState([
		{
			title: "ROADS MONITORED",
			number: "0",
		},
		{
			title: "BRIDGES MONITORED",
			number: "0",
		},
		{
			title: "INCIDENTS REPORTED",
			number: "0",
		},
		{
			title: "ISSUES REPORTED",
			number: "0",
		},
	]);

	useEffect(() => {
		// Issues Reported
		const q = query(collection(db, "reports"));

		getDocs(q).then((snapshot) => {
			const arr = [...items];
			arr[3].number = snapshot.size;
			setItems(arr);
		});
	}, []);

	useEffect(() => {
		// Bridges
		const q = query(
			collection(db, "reports"),
			where("report_type", "==", "BRIDGE")
		);

		getDocs(q).then((snapshot) => {
			const arr = [...items];
			arr[1].number = snapshot.size;
			setItems(arr);
		});
	}, []);

	useEffect(() => {
		// Incidents
		const q = query(
			collection(db, "reports"),
			where("accident_report", "==", true)
		);

		getDocs(q).then((snapshot) => {
			const arr = [...items];
			arr[2].number = snapshot.size;
			setItems(arr);
		});
	}, []);

	useEffect(() => {
		// Roads
		const q = query(
			collection(db, "reports"),
			where("report_type", "==", "ROAD")
		);

		getDocs(q).then((snapshot) => {
			const arr = [...items];
			arr[0].number = snapshot.size;
			setItems(arr);
		});
	}, []);

	// useEffect(() => {
	//   const q = query(collection(db, "reports"));

	//   const REPORT_TYPE = ["ROAD", "BRIDGE"];
	//   const ACCIDENT_REPORT = [true, false];

	//   getDocs(q).then((snapshot) => {
	//     snapshot.forEach((doc_) => {
	//       const R_T_R = Math.floor(Math.random() * REPORT_TYPE.length);
	//       const A_R_R = Math.floor(Math.random() * ACCIDENT_REPORT.length);

	//       updateDoc(doc(db, "reports", doc_.id), {
	//         report_type: REPORT_TYPE[R_T_R],
	//         accident_report: ACCIDENT_REPORT[A_R_R],
	//       }).then((r)=>console.log(r)).catch((e)=>console.log(e))
	//     });
	//   });
	// }, []);

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			{/* Fixed Header */}
			<View style={styles.header}>
				<Text style={styles.dashboardText}>Dashboard</Text>
				<Image
					source={{
						uri:
							user.profileImage ||
							"https://via.placeholder.com/150",
						cache: "force-cache",
					}}
					style={styles.profileImage}
				/>
			</View>
			{/* create a grid here of the three statBoxes */}
			<View style={styles.gridView}>
				<FlatGrid
					itemDimension={Dimensions.get("window").width / 2 - 40}
					spacing={10}
					data={items}
					renderItem={({ item }) => (
						<View style={styles.statBox}>
							<View style={styles.itemContainer}>
								<Text style={styles.itemName}>
									{item.title}
								</Text>
								<Text style={styles.itemCode}>
									{item.number}
								</Text>
							</View>
						</View>
					)}
				/>
			</View>

			{/* Scrollable Content */}
			<ScrollView style={styles.container}>
				<Link
					asChild
					href={"/(tabs)/Maintainance/reporting"}
				>
					<TouchableOpacity style={styles.viewReportsButton}>
						<Text style={styles.viewReportsText}>View Reports</Text>
					</TouchableOpacity>
				</Link>

				<View style={styles.adminActionsContainer}>
					<Text style={styles.adminActionsText}>Admin Actions</Text>
					<View style={styles.actionButtons}>
						<Link
							href="/(tabs)/Profile/admin/audit-log"
							asChild
						>
							<TouchableOpacity style={styles.actionButton}>
								<Text style={styles.actionButtonText}>
									Audit Log
								</Text>
								<AntDesign
									name="table"
									size={20}
									color="black"
									style={styles.icon}
								/>
							</TouchableOpacity>
						</Link>
						<Link
							href="/(tabs)/Profile/admin/manage-officials"
							asChild
						>
							<TouchableOpacity style={styles.actionButton}>
								<Text style={styles.actionButtonText}>
									Manage Officials
								</Text>
								<FontAwesome5
									name="user-tie"
									size={18}
									color="black"
									style={styles.icon}
								/>
							</TouchableOpacity>
						</Link>
						<Link
							href="/(tabs)/Profile/admin/manage-citizens"
							asChild
						>
							<TouchableOpacity style={styles.actionButton}>
								<Text style={styles.actionButtonText}>
									Manage Citizens
								</Text>
								<FontAwesome5
									name="user"
									size={18}
									color="#202A44"
									style={styles.icon}
								/>
							</TouchableOpacity>
						</Link>
						<Link
							href="/(tabs)/Maintainance/analytics"
							asChild
						>
							<TouchableOpacity style={styles.actionButton}>
								<Text style={styles.actionButtonText}>
									View Analytics
								</Text>
								<FontAwesome
									name="bar-chart-o"
									size={16}
									color="#202A44"
									style={styles.icon}
								/>
							</TouchableOpacity>
						</Link>
					</View>
				</View>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F2f9FB",
		paddingHorizontal: 20,
	},
	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		paddingTop: 40,
		paddingHorizontal: 20,
		backgroundColor: "#202A44",
		zIndex: 10,
		paddingBottom: 10,
		height: 100,
	},
	dashboardText: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#fff",
	},
	viewReportsButton: {
		backgroundColor: "#202A44",
		borderRadius: 10,
		width: "100%",
		height: 50,
		justifyContent: "center",
		paddingVertical: 10,
		alignItems: "center",
		// marginTop: -22,
	},
	viewReportsText: {
		color: "#fff",
		fontWeight: "bold",
	},
	adminActionsContainer: {
		backgroundColor: "#fff",
		borderRadius: 10,
		flexDirection: "column",
		padding: 20,
		marginTop: 20,
		shadowColor: "#202A44",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.6,
		shadowRadius: 5,
		elevation: 5,
		height: 300,
	},
	adminActionsText: {
		fontSize: 15,
		fontWeight: "bold",
		marginBottom: 10,
	},
	actionButtons: {
		flexDirection: "column",
		height: 103,
	},
	actionButton: {
		backgroundColor: "#F1F1F1",
		borderRadius: 10,
		padding: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		height: 50,
		marginBottom: 9,
	},
	actionButtonText: {
		fontSize: 14,
		color: "#202A44",
		fontWeight: "bold",
	},
	errorText: {
		fontSize: 18,
		color: "red",
		textAlign: "center",
		marginTop: 20,
	},
	icon: {
		color: "#202A44",
	},
	gridView: {
		marginTop: 100,
	},
	itemContainer: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		padding: 5,
		backgroundColor: "#fff",
		height: 90,
		width: "100%",
		shadowColor: "#202A44",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.6,
		shadowRadius: 5,
		elevation: 5,
	},
	itemName: {
		fontSize: 14,
		color: "#202A44",
		marginTop: 0,
		fontWeight: "bold",
		color: "#202A44",
	},
	itemCode: {
		fontWeight: "bold",
		fontSize: 20,
		color: "#202A44",
	},
	statBox: {
		justifyContent: "center",
	},
});

export default HomeScreen;
