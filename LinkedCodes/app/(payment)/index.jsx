import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
} from "react-native";
import { Link, router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
const OrderScreen = () => {
	const [amount, setAmount] = useState("");

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter Donation Amount</Text>
			<Text style={styles.subtitle}>
				Specify the amount you would like to contribute towards our
				cause.
			</Text>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Enter amount"
					placeholderTextColor="#7D7D7D"
					keyboardType="numeric"
					value={amount}
					onChangeText={setAmount}
				/>
				<Text style={styles.currencySign}>R</Text>
			</View>

			<TouchableOpacity
				style={styles.button}
				onPress={() => {
					if (amount && +amount > 0) {
						router.push({
							pathname: "/(payment)/pay",
							params: { amount },
						});
					} else {
						alert("Please enter an amount to proceed");
					}
				}}
			>
				<View style={styles.buttonContent}>
					<Text style={styles.buttonText}>Payment</Text>
					<Icon
						name="arrow-right"
						size={20}
						color="#fff"
						style={styles.icon}
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		padding: 20,
	},
	title: {
		color: "#202A44",
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 16,
		color: "#7D7D7D",
		textAlign: "center",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "#202A44",
		borderWidth: 1,
		borderRadius: 10,
		height: 50,
		marginTop: 20,
		width: "80%",
		paddingHorizontal: 10,
	},
	input: {
		flex: 1,
		fontSize: 18,
		color: "#202A44",
	},
	currencySign: {
		fontSize: 18,
		color: "#202A44",
		marginLeft: 10,
	},
	button: {
		backgroundColor: "#202A44",
		padding: 15,
		borderRadius: 10,
		marginTop: 20,
		width: "80%",
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	buttonContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
	},
	icon: {
		marginLeft: 10,
	},
});

export default OrderScreen;
