import { signOut } from "firebase/auth";
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	ScrollView,
	Alert,
	Modal
} from "react-native";
// import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import { useUser } from "../../../src/cxt/user";
import "react-native-gesture-handler";
import { Drawer } from "react-native-drawer-layout";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import { auth } from "../../../firebase";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";

const Home = () => {
	const [open, setOpen] = React.useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	const handleMenuPress = () => {
		setOpen(!open);
	};

	const { setUser, user } = useUser();

	const handleLogout = () => {
		signOut(auth);
		setModalVisible(false); 
	  };

	return (
		<Drawer
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			renderDrawerContent={() => {
				// console.log("Drawer Content working!");
				return (
					<View style={styles.drawer}>
						<View style={styles.drawerContent}>
							<Text style={styles.drawerHeader}>Menu</Text>
							{/* I want four links here one for notifications, account, settings, device permissins, logout button, */}
							<TouchableOpacity
								style={styles.drawerItem}
								onPress={() =>
									router.push(
										"/(tabs)/Settings/notifications"
									)
								}
							>
								<Text style={styles.drawerItemText}>
									Notification
								</Text>
								<Icon
									name="bell"
									size={20}
									color="#fff"
									style={styles.drawerIcon}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.drawerItem}
								onPress={() => router.push("/(tabs)/Profile")}
							>
								<Text style={styles.drawerItemText}>
									Profile
								</Text>
								<Icon
									name="user"
									size={22}
									color="#fff"
									style={styles.drawerIcon}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.drawerItem}
								onPress={() => router.push("/(tabs)/Settings")}
							>
								<Text style={styles.drawerItemText}>
									Settings
								</Text>
								<Icon
									name="cog"
									size={20}
									color="#fff"
									style={styles.drawerIcon}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.drawerItem}
								onPress={() =>
									router.push("/(tabs)/Settings/permissions")
								}
							>
								<Text style={styles.drawerItemText}>
									Permissions
								</Text>
								<Icon2
									name="fingerprint"
									size={20}
									color="#fff"
									style={styles.drawerIcon}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.drawerItem}
								onPress={() =>
									router.push("/(tabs)/Home/support-us")
								}
							>
								<Text style={styles.drawerItemText}>
									Support Us
								</Text>
								<FontAwesome5
									name="hand-holding-usd"
									size={18}
									color="#fff"
								/>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.drawerItem}
								onPress={() => setModalVisible(true)}
							>
								<Text style={styles.drawerItemText}>Logout</Text>
								<Icon name="sign-out" size={20} color="#fff" style={styles.drawerIcon} />
							</TouchableOpacity>

						<Modal
								transparent={true}
								animationType="slide"
								visible={modalVisible}
								onRequestClose={() => setModalVisible(false)}
							>
								<View style={styles.modalOverlay}>
								<View style={styles.modalContent}>
									<Icon name="sign-out" size={40} color="#202A44" style={styles.logoutIcon} />
									<Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
									<View style={styles.modalButtons}>
									<TouchableOpacity
										style={styles.cancelButton}
										onPress={() => setModalVisible(false)}
									>
										<Text style={styles.cancelText}>Cancel</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.logoutButton}
										onPress={handleLogout}
									>
										<Text style={styles.buttonText}>Logout</Text>
									</TouchableOpacity>
									</View>
								</View>
								</View>
							</Modal>
						</View>
					</View>
				);
			}}
		>
			<View style={styles.container}>
				{/* Fixed header with hamburger button */}
				<View style={styles.headerContainer}>
					<TouchableOpacity
						onPress={handleMenuPress}
						style={styles.hamburgerButton}
					>
						<Icon
							name="bars"
							size={24}
							color="#202A44"
						/>
					</TouchableOpacity>
					<Text style={styles.appName}>InfraSmart</Text>
				</View>

				{/* Scrollable content */}
				<ScrollView style={styles.content}>
					<Link
						style={styles.manageButton}
						asChild
						href="/(tabs)/Maintainance/reporting"
					>
						<TouchableOpacity style={styles.manageButton}>
							<Text style={styles.manageButtonText}>
								Manage Reports
							</Text>
							<Icon
								name="file-text"
								size={24}
								color="#FFF"
								style={styles.buttonIcon}
							/>
						</TouchableOpacity>
					</Link>
					{/* Upcoming Maintenance Button */}
					<Link
						style={styles.upcomingButton}
						asChild
						href="/(tabs)/Maintainance/maintain"
					>
						<TouchableOpacity style={styles.upcomingButton}>
							<Text style={styles.upcomingButtonText}>
								Maintenance
							</Text>
							<Icon
								name="wrench"
								size={24}
								color="#FFF"
								style={styles.buttonIcon}
							/>
						</TouchableOpacity>
					</Link>

					{/* analytics graphs down here, also they should scroll horizontally, still coming up with an idea*/}
					<Text style={styles.overviewText}>Analytics</Text>
					<Link
						style={styles.upcomingButton}
						asChild
						href="/(tabs)/Maintainance/analytics"
					>
						<TouchableOpacity style={styles.card}>
							<Image
								source={require("../../../assets/graph1.jpeg")}
								style={styles.image}
							/>
							<Text style={styles.headline}>
								Predictive Analysis
							</Text>
						</TouchableOpacity>
					</Link>

					<Link
						style={styles.upcomingButton}
						asChild
						href="/(tabs)/Maintainance/analytics-maintainance"
					>
						<TouchableOpacity style={styles.card}>
							<Image
								source={require("../../../assets/graph1.jpeg")}
								style={styles.image}
							/>
							<Text style={styles.headline}>
								Maintainance History
							</Text>
						</TouchableOpacity>
					</Link>

					<Link
						style={styles.upcomingButton}
						asChild
						href="/(tabs)/Maintainance/analytics"
					>
						<TouchableOpacity style={styles.card}>
							<Image
								source={require("../../../assets/graph2.jpeg")}
								style={styles.image}
							/>
							<Text style={styles.headline}>
								User Satisfaction
							</Text>
						</TouchableOpacity>
					</Link>

					{/* Recent Updates Section */}
					<Text style={styles.recentUpdatesTitle}>
						Recent Updates
					</Text>

					<Link
						style={styles.upcomingButton}
						asChild
						href="/(tabs)/Maintainance/reporting"
					>
						<TouchableOpacity style={styles.card}>
							<Image
								source={require("../../../assets/road.png")}
								style={styles.image}
							/>
							<Text style={styles.headline}>
								Pothole Repair Completed
							</Text>
						</TouchableOpacity>
					</Link>

					<Link
						style={styles.upcomingButton}
						asChild
						href="/(tabs)/Maintainance/maintain"
					>
						<TouchableOpacity style={styles.card}>
							<Image
								source={require("../../../assets/bridge.png")}
								style={styles.image}
							/>
							<Text style={styles.headline}>
								Bridge Inspection Scheduled
							</Text>
						</TouchableOpacity>
					</Link>

					{/* <TouchableOpacity style={styles.viewAllButton}>
						<Text style={styles.viewAllText}>View All Updates</Text>
					</TouchableOpacity>

					<View style={styles.educationalSection}>
						<Text style={styles.educationalText}>
							Learn about the latest maintenance practices and
							reporting tools.
						</Text>
					</View> */}
				</ScrollView>
			</View>
		</Drawer>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F2f9FB",
	},
	headerContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		padding: 20,
		justifyContent: "space-between",
		alignItems: "center",
		zIndex: 10,
		backgroundColor: "#fff",
	},
	hamburgerButton: {
		padding: 10,
		marginTop: 20,
	},
	appName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#202A44",
		marginTop: 20,
	},
	content: {
		marginTop: 130,
		paddingHorizontal: 20,
	},
	overviewText: {
		fontSize: 20,
		fontWeight: "bold",
		marginVertical: 20,
		color: "#202A44",
	},
	manageButton: {
		backgroundColor: "#202A44",
		borderRadius: 10,
		paddingVertical: 15,
		alignItems: "center",
		marginBottom: 10,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	manageButtonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 10,
	},
	upcomingButton: {
		backgroundColor: "#202A44",
		borderRadius: 10,
		paddingVertical: 15,
		alignItems: "center",
		marginBottom: 20,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	upcomingButtonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
		marginLeft: 10,
	},
	recentUpdatesTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginVertical: 10,
		color: "#202A44",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 15,
		shadowColor: "#202A44",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.6,
		shadowRadius: 5,
		elevation: 5,
		padding: 15,
		marginVertical: 10,
		flexDirection: "column",
	},
	image: {
		width: "100%",
		height: 150,
		borderRadius: 10,
		marginBottom: 10,
	},
	headline: {
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "left",
		color: "#202A44",
	},
	viewAllButton: {
		alignItems: "center",
		marginVertical: 10,
	},
	viewAllText: {
		color: "#202A44",
		fontSize: 16,
		fontWeight: "bold",
	},
	contentContainer: {
		flex: 1,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 50,
		width: "100%",
		height: 275,
		backgroundColor: "#202A44",
		borderRadius: 15,
		shadowColor: "#202A44",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 5,
		elevation: 5,
		marginVertical: 10,
		alignItems: "center",
		marginBottom: 34,
	},
	controlsContainer: {
		padding: 10,
	},
	customButton: {
		backgroundColor: "#202A44",
		padding: 10,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#FFFFFF",
		fontSize: 18,
		fontWeight: "bold",
	},
	buttonIcon: {
		marginRight: 15,
	},
	drawer: {
		flex: 1,
		backgroundColor: "#F2f9FB",
	},
	drawerContent: {
		paddingTop: 50,
		paddingHorizontal: 20,
		alignItems: "flex-start",
		flex: 1,
	},
	drawerHeader: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#202A44",
	},
	drawerItem: {
		paddingVertical: 15,
		paddingHorizontal: 10,
		width: "100%",
		backgroundColor: "#202A44",
		marginBottom: 10,
		borderRadius: 10,
		borderColor: "#ccc",
		borderWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	drawerItemText: {
		fontSize: 15,
		color: "#fff",
	},
	drawerIcon: {
		marginLeft: 23,
	},

	
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	  },
	  modalContent: {
		width: 300,
		padding: 20,
		backgroundColor: '#F2f9FB',
		borderRadius: 10,
		alignItems: 'center',
		height:350,
		justifyContent:'center'
	  },
	  modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	  },
	  modalMessage: {
		marginVertical: 10,
		textAlign: 'center',
		marginBottom:40,
		fontSize:20
	  },
	  modalButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		
	  },
	  cancelButton: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		backgroundColor: '#ddd',
		borderRadius: 5,
		marginRight: 5,
	  },
	  logoutButton: {
		flex: 1,
		padding: 10,
		alignItems: 'center',
		backgroundColor: '#202A44',
		borderRadius: 5,
		marginLeft: 5,
	  },
	  buttonText: {
		color: '#F2f9FB',
		fontWeight: 'bold',
	  },
	  cancelText: {
		color: '#202A44',
		fontWeight: 'bold',
	  },
	  logoutIcon:{
		marginBottom:40
	  }
});
