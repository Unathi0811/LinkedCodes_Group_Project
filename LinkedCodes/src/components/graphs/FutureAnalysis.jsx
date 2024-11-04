import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../firebase";

const FutureAnalysis = () => {
	const [data, setData] = useState([
		{ value: 50 },
		{ value: 80 },
		{ value: 90 },
		{ value: 70 },
	]);
	const [fdata, setFData] = useState([
		{ value: 50 },
		{ value: 80 },
		{ value: 90 },
		{ value: 70 },
	]);
	const [poinst, setPoints] = useState({
		highest: 0,
		lowest: 0,
		avarage: 0,
		fhighest: 0,
		flowest: 0,
		favarage: 0,
	});

	useEffect(() => {
		const q = query(collection(db, "reports"), orderBy("timestamp"));
		getDocs(q).then((snapshot) => {
			const data = [];
			let lastTimestamp = 0;

			// Group data by day and count occurrences
			snapshot.docs.forEach((doc) => {
				const date = new Date(doc.data().timestamp.seconds * 1000);
				lastTimestamp = doc.data().timestamp.seconds;

				const day = date.getDate();
				const month = date.getMonth();
				const key = `${day}/${month}`;

				const index = data.findIndex((d) => d.label === key);
				if (index === -1) {
					data.push({
						value: 1,
						dataPointColor: "red",
						labelTextStyle: {
							color: "red",
							transform: [{ rotate: "-60deg" }],
						},
						label: key,
					});
				} else {
					data[index].value += 1;
				}
			});
			setData(data);

			// Calculate the average daily change over the last few days
			let averageIncrease = 0;
			for (let i = 1; i < data.length; i++) {
				averageIncrease += data[i].value - data[i - 1].value;
			}
			averageIncrease = averageIncrease / Math.max(1, data.length - 1);

			// Predict future data based on the average daily increase
			const futureData = [];
			const lastData = data[data.length - 1];
			for (let i = 0; i < 5; i++) {
				const date = new Date(lastTimestamp * 1000);
				date.setDate(date.getDate() + i + 1);
				const key = `${date.getDate()}/${date.getMonth()}`;

				// Predict the value based on the average increase and add some randomness
				const predictedValue = Math.max(
					0,
					Math.round(
						lastData.value +
							averageIncrease * (i + 1) -
							Math.random() *
								Math.max(
									Math.abs(averageIncrease * 0.5),
									Math.random() * 10
								)
					)
				);
				futureData.push({
					value: predictedValue,
					dataPointColor: "green",
					labelTextStyle: {
						color: "green",
						transform: [{ rotate: "-60deg" }],
					},
					label: key,
				});
			}

			setFData(futureData);

			// Calculate some statistics
			const highest = Math.max(...data.map((d) => d.value));
			const lowest = Math.min(...data.map((d) => d.value));
			const average =
				data.reduce((acc, d) => acc + d.value, 0) / data.length;

			const fhighest = Math.max(...futureData.map((d) => d.value));
			const flowest = Math.min(...futureData.map((d) => d.value));
			const faverage =
				futureData.reduce((acc, d) => acc + d.value, 0) /
				futureData.length;

			setPoints({
				highest,
				lowest,
				avarage: average,
				fhighest,
				flowest,
				favarage: faverage,
			});
		});
	}, []);

	return (
		<View style={styles.card}>
			<Text style={styles.title}>Future Report Forecast</Text>
			<Text style={styles.subTitle}>
				Reports per day and future forecast
			</Text>
			<View style={{ justifyContent: "center", gap: 5 }}>
				<Text style={styles.average}>Now data</Text>
				<View style={{ flexDirection: "row", gap: 10 }}>
					<Text style={styles.average}>
						Highest: {poinst.highest}
					</Text>
					<Text style={styles.average}>Lowest: {poinst.lowest}</Text>
					<Text style={styles.average}>
						Average: {poinst.avarage}
					</Text>
				</View>
			</View>
			<View style={{ justifyContent: "center", gap: 5, marginTop: 10 }}>
				<Text style={styles.average}>Future data</Text>
				<View style={{ flexDirection: "row", gap: 10 }}>
					<Text style={styles.average}>
						Highest: {poinst.fhighest}
					</Text>
					<Text style={styles.average}>Lowest: {poinst.flowest}</Text>
					<Text style={styles.average}>
						Average: {poinst.favarage}
					</Text>
				</View>
			</View>
			<View style={{ marginTop: 20 }} />
			<LineChart
				data={[...data, ...fdata]}
				gradientDirection="vertical"
				lineGradient
				width={370 - 100}
				spacing={30}
			/>
		</View>
	);
};

export default FutureAnalysis;

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
		fontSize: 14,
		color: "#202A44",
		textAlign: "center",
	},
	axisLabel: {
		color: "#202A44",
		fontSize: 14,
	},
});
