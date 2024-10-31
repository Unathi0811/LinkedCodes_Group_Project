import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const ReviewsAnalytics = () => {
	const [data, setData] = useState([
		{ value: 0, label: 1 },
		{ value: 0, label: 2 },
		{ value: 0, label: 3 },
		{ value: 0, label: 4 },
		{ value: 0, label: 5 },
	]);
	const [avg, setAvg] = useState(0);

	useEffect(() => {
		const q = query(collection(db, "reviews"), where("rating", "==", 1));
		const q1 = query(collection(db, "reviews"), where("rating", "==", 2));
		const q2 = query(collection(db, "reviews"), where("rating", "==", 3));
		const q3 = query(collection(db, "reviews"), where("rating", "==", 4));
		const q4 = query(collection(db, "reviews"), where("rating", "==", 5));

		getDocs(q).then((snapshot) => {
			const arr = [...data];
			arr[0].value = snapshot.size;
			setData(arr);
		});
		getDocs(q1).then((snapshot) => {
			const arr = [...data];
			arr[1].value = snapshot.size;
			setData(arr);
		});
		getDocs(q2).then((snapshot) => {
			const arr = [...data];
			arr[2].value = snapshot.size;
			setData(arr);
		});
		getDocs(q3).then((snapshot) => {
			const arr = [...data];
			arr[3].value = snapshot.size;
			setData(arr);
		});
		getDocs(q4).then((snapshot) => {
			const arr = [...data];
			arr[4].value = snapshot.size;
			setData(arr);
		});
	}, []);

	useEffect(() => {
		const q = query(collection(db, "reviews"));

		getDocs(q).then((snapshot) => {
			const sum = snapshot.docs.reduce(
				(acc, doc) => acc + doc.data().rating,
				0
			);
			const avg = sum / snapshot.docs.length;
			setAvg(avg);
		});

		return () => {};
	}, []);

	return (
		<View style={styles.card}>
			<Text style={styles.title}>User SATISFACTION</Text>
			<Text style={styles.subTitle}>Ratings Analysis</Text>
			<Text style={styles.average}>Average: {avg.toFixed(2)}</Text>
			<BarChart
				data={data}
				barWidth={370 / 5 - 20 - 10}
				barBorderRadius={5}
				frontColor="#202A44"
				showFractionalValue
				showXAxisIndices
				initialSpacing={10}
				spacing={10}
				width={270}
				xAxisColor="#202A44"
				yAxisColor="#202A44"
				yAxisThickness={1}
				xAxisThickness={1}
				yAxisLabelTextStyle={styles.axisLabel}
				xAxisLabelTextStyle={styles.axisLabel}
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

export default ReviewsAnalytics;

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
