import React, { useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TextInput,
	Image,
	Alert,
} from "react-native";
import { Link, router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5"; // Import the FontAwesome icon component
import { Ozow } from "react-native-ozow";
import { auth } from "../../firebase";

const PaymentScreen = () => {
	const { amount } = useLocalSearchParams();
	// const [paymentMethod, setPaymentMethod] = useState("creditCard");
	// const [cardNumber, setCardNumber] = useState("");
	// const [cardHolder, setCardHolder] = useState("");
	// const [expiryDate, setExpiryDate] = useState("");
	// const [cvv, setCvv] = useState("");

	// const paymentMethods = [
	// 	{
	// 		id: "creditCard",
	// 		label: "Credit Card",
	// 		image: require("../../assets/image.png"),
	// 	},
	// 	{
	// 		id: "debitCard",
	// 		label: "Debit Card",
	// 		image: require("../../assets/image.png"),
	// 	},
	// 	{
	// 		id: "paypal",
	// 		label: "PayPal",
	// 		image: require("../../assets/image.png"),
	// 	},
	// ];

	console.log(auth.currentUser.uid, +amount);

	return (
		<Ozow
			data={{
				SiteCode: "IPR-IPR-003",
				Amount: +amount, // in rands
				TransactionReference: `${auth.currentUser.uid}-${Date.now()}`,
				BankReference:
					+amount === 99
						? "InfraSmart-Premium"
						: "InfraSmart-Donation",
				Customer: auth.currentUser.email,
				CancelUrl: "https://ozow.com",
				ErrorUrl: "https://ozow.com",
				SuccessUrl: "https://ozow.com",
				NotifyUrl: "https://ozow.com",
			}}
			privateKey="f276b028558946308361979e4bf88ffa"
			onErrorMessage={(data) => {
				console.log(data);
				Alert.alert("Error", data.Message);
				router.push("/(userTabs)/home/premium");
			}}
			onPaymentCancel={(data) => {
				Alert.alert("Payment Cancelled", "Payment was cancelled");
				router.push("/(userTabs)/home/premium");
			}}
			onPaymentSuccess={(data) => {
				Alert.alert("Payment Success", "Payment was successful");
				router.push("/(userTabs)/home/premium");
			}}
		/>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Enter Payment Information</Text>
			<Text style={styles.subtitle}>
				Provide your card information to securely proceed with the
				donation.
			</Text>

			{/* Payment Method Selector */}
			<View style={styles.paymentMethodContainer}>
				{paymentMethods.map((method) => (
					<TouchableOpacity
						key={method.id}
						style={[
							styles.paymentMethod,
							paymentMethod === method.id &&
								styles.selectedMethod,
						]}
						onPress={() => setPaymentMethod(method.id)}
					>
						<Image
							source={method.image}
							style={styles.paymentIcon}
						/>
						<Text style={styles.paymentLabel}>{method.label}</Text>
					</TouchableOpacity>
				))}
			</View>

			{/* Card Details Inputs */}
			<TextInput
				style={styles.input}
				placeholder="Card Number"
				placeholderTextColor="#7D7D7D"
				keyboardType="numeric"
				value={cardNumber}
				onChangeText={setCardNumber}
			/>
			<TextInput
				style={styles.input}
				placeholder="Card Holder Name"
				placeholderTextColor="#7D7D7D"
				value={cardHolder}
				onChangeText={setCardHolder}
			/>
			<View style={styles.row}>
				<TextInput
					style={[styles.input, styles.halfInput]}
					placeholder="MM/YY"
					placeholderTextColor="#7D7D7D"
					value={expiryDate}
					onChangeText={setExpiryDate}
				/>
				<TextInput
					style={[styles.input, styles.halfInput]}
					placeholder="CVV"
					placeholderTextColor="#7D7D7D"
					keyboardType="numeric"
					value={cvv}
					onChangeText={setCvv}
				/>
			</View>

			<Link
				href="/(payment)/confirm"
				asChild
			>
				<TouchableOpacity style={styles.button}>
					<View style={styles.buttonContent}>
						<Text style={styles.buttonText}>Review</Text>
						<Icon
							name="arrow-right"
							size={20}
							color="#fff"
							style={styles.icon}
						/>
					</View>
				</TouchableOpacity>
			</Link>
		</View>
	);
};

export default PaymentScreen;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
		padding: 20,
	},
	title: {
		color: "#202A44",
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
		marginTop: 20,
	},
	subtitle: {
		fontSize: 16,
		color: "#7D7D7D",
		textAlign: "center",
		marginBottom: 20,
	},
	paymentMethodContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		marginBottom: 20,
	},
	paymentMethod: {
		alignItems: "center",
		padding: 10,
	},
	selectedMethod: {
		borderColor: "#202A44",
		borderWidth: 2,
		borderRadius: 10,
	},
	paymentIcon: {
		width: 50,
		height: 30,
		marginBottom: 5,
	},
	paymentLabel: {
		color: "#202A44",
		fontSize: 14,
	},
	input: {
		height: 50,
		borderColor: "#202A44",
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 10,
		marginBottom: 15,
		width: "80%",
		fontSize: 18,
		color: "#202A44",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "80%",
	},
	halfInput: {
		width: "45%",
	},
	button: {
		backgroundColor: "#202A44",
		padding: 15,
		borderRadius: 10,
		width: "80%",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20,
	},
	buttonContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	icon: {
		marginLeft: 10,
	},
});
