import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	FlatList,
} from "react-native";
import { Link, router, Stack } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
const OrderScreen = () => {
	const [data, setData] = useState([
		{
			amount: 99,
			bankReference: "InfraSmart-Premium",
			customerEmail: "test11@gmail.com",
			id: "892SYcBNi69TBbAGZ4I3",
			timestamp: [Object],
			transactionReference: "XtfGyKCYWDWIZ4DlDVLy6AWUahG3-1730647937556",
			userId: "XtfGyKCYWDWIZ4DlDVLy6AWUahG3",
		},
		{
			amount: 1,
			bankReference: "InfraSmart-Donation",
			customerEmail: "test11@gmail.com",
			id: "q5sg3OsKcy9GDs1B8vW4",
			timestamp: [Object],
			transactionReference: "XtfGyKCYWDWIZ4DlDVLy6AWUahG3-1730647894846",
			userId: "XtfGyKCYWDWIZ4DlDVLy6AWUahG3",
		},
	]);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		getDocs(
			query(
				collection(db, "payments"),
				where("userId", "==", auth.currentUser.uid)
			)
		)
			.then((s) => {
				setData(s.docs.map((i) => ({ ...i.data(), id: i.id })));
				setTotal(
					s.docs.reduce((acc, doc) => acc + doc.data().amount, 0)
				);
			})
			.catch((e) => {
				console.log(e);
				alert("Failed getting transactions at this moment");
			});
	}, []);

	return (
		<>
			<Stack.Screen
				options={{
					title: "Payment History",
				}}
			/>
			<FlatList
				data={data}
				renderItem={({ item }) => (
					<View>
						<Text>{item.id}</Text>
						<Text>{item.bankReference}</Text>
						<Text>
							{new Date(
								item?.timestamp?.seconds
							).toLocaleString()}
						</Text>
						<Text>{item.transactionReference}</Text>
						<Text>{item.amount}</Text>
					</View>
				)}
				ListFooterComponent={() => (
					<View>
						<Text>Total: R {total.toFixed(2)}</Text>
					</View>
				)}
			/>
		</>
	);
};

const styles = StyleSheet.create({});

export default OrderScreen;
