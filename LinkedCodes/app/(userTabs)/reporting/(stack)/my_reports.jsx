import { useEffect, useState } from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Modal,
	Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { auth, db } from "../../../../firebase";
import { checkIfOnline } from "../../../../services/network";
import { router, Stack, Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const deleteReport = async (reportId, imageUri) => {
	try {
		const isOnline = await checkIfOnline();
		if (isOnline) {
			const reportRef = doc(db, "reports", reportId);
			await deleteDoc(reportRef);

			if (!imageUri) return true;

			const imageRef = ref(storage, imageUri);
			await deleteObject(imageRef);
			return true;
		}
	} catch (error) {
		console.log("[DELETE REPORT]: ", error);
		return false;
	}
};

const HistoricalReportsScreen = () => {
	const userId = auth.currentUser.uid;

	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedReport, setSelectedReport] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const isOnline = await checkIfOnline();
			if (isOnline && userId) {
				const unsubscribe = loadReportsFromFirestore(); // Load reports in real-time
				setLoading(false);
				return () => unsubscribe(); // Cleanup listener on unmount
			}
			// Load locally stored reports if offline
			await loadReportsFromLocalStorage();
			setLoading(false);
		};

		fetchData();
	}, []);

	// Load reports from Firestore in real-time (if online) or from AsyncStorage (if offline)
	const loadReportsFromFirestore = () => {
		if (!userId) return; // Exit if no user is authenticated
		// const q = collection(db, "reports"); // Query the reports collection
		const q = query(
			collection(db, "reports"),
			where("userId", "==", userId)
		);
		return onSnapshot(
			q,
			(snapshot) => {
				const loadedReports = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setReports(loadedReports);
			},
			(error) => {
				console.log("Error loading reports from Firestore: ", error);
			}
		);
	};

	// Load reports from AsyncStorage (when offline)
	const loadReportsFromLocalStorage = async () => {
		try {
			const storedReports = await AsyncStorage.getItem("offlineReports");
			if (storedReports) {
				setReports(JSON.parse(storedReports));
			}
		} catch (error) {
			console.error("Error loading reports from local storage:", error);
		}
	};

	console.log("SELECTED REPORT: ", selectedReport);

	const renderItem = ({ item }) => (
		<TouchableOpacity onPress={() => setSelectedReport(item)}>
			<View style={styles.reportItem}>
				<Image
					source={{ uri: item.image }}
					style={styles.imageThumbnail}
				/>
				<View style={styles.textContainer}>
					<Text style={styles.description}>
						{item.description?.trim()}
					</Text>
					<Text style={styles.timestamp}>
						{item.timestamp.toDate().toLocaleString()}
					</Text>
					<Text style={styles.urgency}>Urgency: {item.urgency}</Text>
					<Text style={styles.urgency}>
						Category: {item.category}
					</Text>
				</View>
				<TouchableOpacity
					onPress={async () => {
						if (await deleteReport(item.id, item?.imageRef)) {
							alert("Report deleted successfully.");
						}
					}}
				>
					<Icon
						name="trash"
						size={24}
						color="#000"
					/>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					title: "My Reports",
					headerLeft: ({ tintColor }) => (
						<Pressable
							style={{
								marginRight: 20,
							}}
							onPress={router.back}
						>
							<AntDesign
								name="arrowleft"
								size={24}
								color={tintColor}
							/>
						</Pressable>
					),
				}}
			/>
			{loading ? (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<ActivityIndicator size="large" />
				</View>
			) : (
				<>
					<Modal
						transparent={true}
						visible={selectedReport && true}
						animationType="slide"
					>
						<TouchableOpacity
							style={styles.modalBackground}
							onPress={() => setSelectedReport(null)}
						>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.modalContainer}
							>
								{selectedReport && (
									<View
										style={{
											gap: 10,
											width: "100%",
										}}
									>
										<Text style={styles.modalHeader}>
											Report Details
										</Text>
										<Image
											source={{
												uri: selectedReport.image,
												cache: "force-cache",
											}}
											style={{
												width: "100%",
												height: 150,
												borderRadius: 10,
												marginBottom: 20,
											}}
										/>
										<Text style={styles.description}>
											Description:{" "}
											{selectedReport.description?.trim()}
										</Text>
										<Text style={styles.timestamp}>
											Date:{" "}
											{selectedReport.timestamp
												.toDate()
												.toLocaleString()}
										</Text>
										<Text style={styles.urgency}>
											Urgency: {selectedReport.urgency}
										</Text>
										<Text style={styles.status}>
											Status:{" "}
											{selectedReport.status ||
												"No Status"}
										</Text>
									</View>
								)}
								<TouchableOpacity
									style={[
										{
											marginTop: 20,
										},
										styles.button,
									]}
									onPress={() => setSelectedReport(null)}
								>
									<Text
										style={[
											{
												paddingHorizontal: 20,
												paddingVertical: 10,
												backgroundColor: "red",
												borderRadius: 20,
												color: "white",
											},
											styles.buttonText,
										]}
									>
										Close
									</Text>
								</TouchableOpacity>
							</TouchableOpacity>
						</TouchableOpacity>
					</Modal>
					<FlatList
						data={reports}
						keyExtractor={(item) => item.id}
						renderItem={renderItem}
						contentContainerStyle={{
							paddingHorizontal: 10,
							paddingVertical: 5,
						}}
						ListEmptyComponent={() => (
							<View
								style={{
									alignItems: "center",
								}}
							>
								<Text style={styles.title}>
									No Reports Available
								</Text>
							</View>
						)}
					/>
					{/* Modal for report details */}
				</>
			)}
		</>
	);
};

// Styles remain unchanged
const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#F2f9FB",
	},
	title: {
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 15,
		color: "#202A44",
		flex: 1,
	},
	reportItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
		backgroundColor: "#fff",
		borderRadius: 12,
		marginBottom: 10,
		// elevation: 5,
	},
	imageThumbnail: {
		width: 100,
		height: 100,
		borderRadius: 30,
	},
	textContainer: {
		flex: 1,
		paddingLeft: 10,
	},
	description: {
		fontSize: 16,
	},
	timestamp: {
		fontSize: 12,
		color: "#888",
	},
	urgency: {
		fontSize: 14,
		fontWeight: "bold",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#fff",
		elevation: 2,
		height: 200,
		marginTop: 200,
		zIndex: 10,
	},
	backButton: {
		padding: 10,
		marginRight: 10,
	},
	headerApp: {
		fontSize: 25,
		fontWeight: "bold",
		color: "#202A44",
	},
	modalBackground: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
	},
	modalContainer: {
		width: "80%",
		minHeight: 220,
		borderRadius: 10,
		padding: 20,
		backgroundColor: "#EAF1FF",
		alignItems: "center",
		justifyContent: "center",
	},

	modalHeader: {
		textAlign: "center",
		fontSize: 26,
		color: "#202A44",
		fontWeight: "bold",
		marginBottom: 20,
	},
});

export default HistoricalReportsScreen;
