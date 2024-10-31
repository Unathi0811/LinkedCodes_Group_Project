import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const colors = [
	"#FF6633",
	"#FFB399",
	"#FF33FF",
	"#FFFF99",
	"#00B3E6",
	"#E6B333",
];

const ReportTypeAnalyticts = () => {
	const [data, setData] = useState([
		{ value: 0, label: 1 },
		{ value: 0, label: 2 },
	]);
	const [avg, setAvg] = useState(0);

	useEffect(() => {
		const q = query(collection(db, "reports"));
		const types = [];

		getDocs(q).then((snapshot) => {
			try {
				// Collect unique report types
				snapshot.docs.forEach((doc) => {
					const type = doc.data().report_type;
					if (type && !types.includes(type)) {
						types.push(type);
					}
				});

				// Map each type to a query for counting occurrences
				const typeQueries = types.map((type, i) => {
					const typeQuery = query(
						collection(db, "reports"),
						where("report_type", "==", type)
					);

					// Return a promise that resolves with the type and count
					return getDocs(typeQuery).then((snapshot) => ({
						label: type,
						value: snapshot.size,
						color: colors[i],
					}));
				});

				// Use Promise.all to wait for all queries to complete
				Promise.all(typeQueries).then((results) => {
					// Update state once all counts are fetched
					setData(results);
				});
			} catch (error) {
				console.error("Error fetching report types and counts:", error);
			}
		});
	}, []);

	useEffect(() => {
		setAvg(data.reduce((acc, { value }) => acc + value, 0) / data.length);
	}, [data]);

	return (
		<View style={styles.card}>
			<Text style={styles.title}>Type of report </Text>
			<Text style={styles.subTitle}>Reports Distribution Analysis</Text>
			<Text style={styles.average}>Average: {avg.toFixed(2)}</Text>
			<View
				style={{
					flexDirection: "row",
					gap: 10,
					marginBottom: 10,
				}}
			>
				{data.map((item, index) => (
					<Text
						key={index}
						style={[
							styles.axisLabel,
							{ color: item.color, fontWeight: "bold" },
						]}
					>
						• {item.label}: {item.value}
					</Text>
				))}
			</View>
			<PieChart
				data={data}
				adjustToWidth
				isAnimated
				autoCenterTooltip
				renderTooltip={(value) => (
					<Text
						style={{
							color: "#fff",
							fontSize: 16,
							fontWeight: "bold",
							backgroundColor: "green",
							textAlign: "center",
							width: 20,
							height: 20,
							borderRadius: 50,
						}}
					>
						{value.value}
					</Text>
				)}
			/>
		</View>
	);
};

export default ReportTypeAnalyticts;

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		marginVertical: 10,
		width: 370,
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
