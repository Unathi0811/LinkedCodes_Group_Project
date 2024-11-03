import React from "react";
import { Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ozow } from "react-native-ozow";
import { auth } from "../../firebase";
import { useUser } from "../../src/cxt/user";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaymentScreen = () => {
	const { user } = useUser();
	const { amount } = useLocalSearchParams();

	const TransactionReference = `${auth.currentUser.uid}-${Date.now()}`;

	//make the three functions so that i can conditinally render or route
	const handlePaymentSuccess = async (data) => {
		// Create a payment record
		const paymentData = {
			userId: auth.currentUser.uid,
			amount: +amount,
			transactionReference: TransactionReference,
			bankReference:
				+amount === 99 ? "InfraSmart-Premium" : "InfraSmart-Donation",
			customerEmail: auth.currentUser.email,
			timestamp: new Date(),
		};

		await AsyncStorage.setItem(
			`isSubscribed_${auth.currentUser.uid}`,
			"true"
		);

		try {
			// Store the payment data in Firestor
			await addDoc(collection(db, "payments"), paymentData);
			const routeTo =
				user.userType === true ? "/(tabs)/Home/" : "/(userTabs)/home/";
			router.push(routeTo);
			Alert.alert("Payment Success", "Payment was successful");
		} catch (error) {
			console.error("Error storing payment data: ", error);
			Alert.alert(
				"Error",
				"There was an issue storing your payment information. Please contact us for help"
			);
		}
	};

	const handlePaymentCancel = (data) => {
		Alert.alert("Payment Cancelled", "Payment was cancelled");
		const routeTo =
			user.userType === true ? "/(tabs)/Home/" : "/(userTabs)/home/";
		router.push(routeTo);
	};

	const handleErrorMessage = (data) => {
		Alert.alert("Error", data.Message);
		const routeTo =
			user.userType === true ? "/(tabs)/Home/" : "/(userTabs)/home/";
		router.push(routeTo);
	};

	return (
		<Ozow
			data={{
				SiteCode: "IPR-IPR-003",
				Amount: +amount,
				TransactionReference,
				BankReference:
					+amount === 99
						? "InfraSmart-Premium"
						: "InfraSmart-Donation",
				Customer: auth.currentUser.email,
				CancelUrl: "https://ozow.com",
				ErrorUrl: "https://ozow.com",
				SuccessUrl: "https://ozow.com",
				NotifyUrl: "https://ozow.com",
				// IsTest: true,
			}}
			privateKey="f276b028558946308361979e4bf88ffa"
			onErrorMessage={handleErrorMessage}
			onPaymentCancel={handlePaymentCancel}
			onPaymentSuccess={handlePaymentSuccess}
		/>
	);
};

export default PaymentScreen;
