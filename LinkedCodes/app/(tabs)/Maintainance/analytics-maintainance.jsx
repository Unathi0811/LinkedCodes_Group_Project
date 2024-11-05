import {
	ScrollView,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from "react-native";
import React from "react";
import ReviewsAnalytics from "../../../src/components/graphs/Reviews";
import { Stack, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import CategotyAnalytics from "../../../src/components/graphs/ReportsCategory";
import FutureAnalysis from "../../../src/components/graphs/FutureAnalysis";
import ReportTypeAnalyticts from "../../../src/components/graphs/TypeOfReport";
import MaintainaceAnalytics from "../../../src/components/graphs/historyMaintainance";
import MaintenanceStatus from "../../../src/components/graphs/historyMaintainanceStatus";

const Analytics = () => {
	const router = useRouter();

	return (
		<View style={styles.container}>
			<Stack.Screen
				options={{
					headerShown: true,
					headerStyle: {},
					headerTitle: "Analytics Maintainance",
					headerLeft: () => (
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
						>
							<Icon
								name="arrow-left"
								size={20}
								color="#202A44"
							/>
						</TouchableOpacity>
					),
				}}
			/>
			{/* ScrollView for Graphs */}
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={styles.scrollContent}
			>
				<MaintainaceAnalytics />
				<MaintenanceStatus />
			</ScrollView>
		</View>
	);
};

export default Analytics;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F2f9FB",
	},
	header: {
		position: "absolute",
		left: 0,
		right: 0,
		flexDirection: "row",
		alignContent: "space-between",
		alignItems: "center",
		padding: 20,
		zIndex: 10,
		backgroundColor: "#F2f9FB",
		height: 100,
	},
	backButton: {
		padding: 10,
		marginRight: 10,
	},
	headerApp: {
		fontSize: 25,
		fontWeight: "bold",
		color: "#202A44",
		marginLeft: 130,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
});
