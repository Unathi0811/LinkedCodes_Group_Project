import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const CategotyAnalytics = () => {
	const [data, setData] = useState([
		{ value: 5, text: 1, color: "pink" },
		{ value: 5, text: 2, color: "purple" },
	]);

	useEffect(() => {
		const q = query(
			collection(db, "reports"),
			where("accident_report", "==", false)
		);
		getDocs(q).then((snapshot) => {
			const arr = [...data];
			arr[0].value = snapshot.size;
			arr[0].text = "Non-Accident";
			arr[0].color = "pink";

			setData(arr);
		});
		const q1 = query(
			collection(db, "reports"),
			where("accident_report", "==", true)
		);
		getDocs(q1).then((snapshot) => {
			const arr = [...data];
			arr[1].value = snapshot.size;
			arr[1].color = "purple";
			arr[1].text = "Accident";

			setData(arr);
		});
	}, []);

	return (
		<View style={styles.card}>
			<Text style={styles.title}>Reports Categories</Text>
			<Text style={styles.subTitle}>Reports per category</Text>
			<View style={{ flexDirection: "row", gap: 10 }}>
				<Text
					style={[
						styles.average,
						{
							color: "purple",
							fontWeight: "bold",
						},
					]}
				>
					Accident
				</Text>
				<Text
					style={[
						styles.average,
						{
							color: "pink",
							fontWeight: "bold",
						},
					]}
				>
					Non-Accident
				</Text>
			</View>
			<PieChart
				data={data}
				radius={100}
				innerRadius={50}
				outerRadius={100}
				labelRadius={100}
				labelColor="#202A44"
				labelSize={20}
				labelWeight="bold"
				labelBackground="transparent"
				labelShowBackground
				labelBackgroundPadding={10}
				labelBackgroundBorderRadius={10}
				labelBackgroundOpacity={0.5}
				animate
				legend
				legendColor="#202A44"
				legendSize={20}
				legendWeight="bold"
				legendBorderRadius={10}
				legendOpacity={0.5}
				legendPadding={10}
				legendFontFamily="monospace"
			/>
		</View>
	);
};

export default CategotyAnalytics;

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		marginVertical: 10,
		// width: platform 370,, iwant the width to be 370 on android and 300 when ios
		width: Platform.OS === "android" ? 370 : 340,
		shadowColor: "#202A44",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 5,
		alignItems: "center",
		marginTop: 34,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#202A44",
		marginBottom: 5,
		textTransform: "uppercase",
	},
	subTitle: {
		fontSize: 18,
		color: "#6C7A89",
		marginBottom: 10,
	},
	average: {
		fontSize: 16,
		color: "#202A44",
		marginBottom: 15,
	},
	axisLabel: {
		color: "#202A44",
		fontSize: 14,
	},
});
