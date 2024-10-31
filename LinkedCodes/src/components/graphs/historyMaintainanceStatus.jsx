import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const urgencyColors = [
	"#E6B333",
	"#00B3E6",
	"#FFB399",
	"#FF6633",
	"#FF33FF",
	"#FFFF99",
];

const MaintenanceStatus = () => {
	const [data, setData] = useState([
		{ value: 0, text: "Completed", color: urgencyColors[0] },
		{ value: 0, text: "In-Progress", color: urgencyColors[1] },
		{ value: 0, text: "Submitted", color: urgencyColors[2] },
		{ value: 0, text: "UnCategorized", color: urgencyColors[3] },
	]);

	useEffect(() => {
		const q = query(collection(db, "reports"));

		getDocs(q).then((snapshot) => {
			snapshot.docs.forEach((doc) => {
				const urgency = doc.data().status;

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
				} else {
					setData(
						data.map((item) => {
							if (
								item.text.toLocaleLowerCase() ===
								"UnCategorized".toLocaleLowerCase()
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
			<Text style={styles.title}>Reports Status</Text>
			<Text style={styles.subTitle}>Reports per status level</Text>
			<View style={{ flexDirection: "row", gap: 20, overflow: "scroll" }}>
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
			<Text
				style={[
					styles.average,
					{
						color: data[3].color,
						fontWeight: "bold",
					},
				]}
			>
				• {data[3].text} ({data[3].value})
			</Text>
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

export default MaintenanceStatus;

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
