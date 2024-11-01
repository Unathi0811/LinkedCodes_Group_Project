import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const urgencyColors = [
	"#FF6633",
	"#FFB399",
	"#FF33FF",
	"#FFFF99",
	"#00B3E6",
	"#E6B333",
];

const MaintainaceAnalytics = () => {
	const [data, setData] = useState([
		{ value: 0, text: "Low", color: urgencyColors[0] },
		{ value: 0, text: "Medium", color: urgencyColors[1] },
		{ value: 0, text: "High", color: urgencyColors[2] },
	]);

	useEffect(() => {
		const q = query(collection(db, "reports"));

		getDocs(q).then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				const urgency = doc.data().urgency;
				if (urgency) {
					setData(
						data.map((item) => {
							if (
								item.text.toLocaleLowerCase() ===
								urgency.toLocaleLowerCase()
							) {
								item.value += 1;
							}

							return item;
						})
					);
				}
			});
		});
	}, []);

	return (
		<View style={styles.card}>
			<Text style={styles.title}>Reports Urgency</Text>
			<Text style={styles.subTitle}>Reports per urgency level</Text>
			<View style={{ flexDirection: "row", gap: 20 }}>
				{data.map((item, index) => {
					return (
						<Text
							key={index}
							style={[
								styles.average,
								{
									color: item.color,
									fontWeight: "bold",
								},
							]}
						>
							• {item.text} ({item.value})
						</Text>
					);
				})}
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

export default MaintainaceAnalytics;

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		marginVertical: 10,
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
