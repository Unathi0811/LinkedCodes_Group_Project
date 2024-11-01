import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, {useState} from "react";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth } from '../../../../firebase'

// our benefits, what they get when they upgrade, how wmuch it is per year/
//headerShown: true
//a card with the following, premium infraSmart
//Your plan will automatically renew on ...... . You will be charged R800/year

//a long card with the following
//You will get access to premium features, including
//  - 24/7 support
//  -  priority to the app without
//  -  1 verified premium account
//  -  cancel anytime
// a button to proceed to checkout
//a button to cancel

const Index = () => {
	// Get current date and to add 1 year
	const currentDate = new Date();
	const nextYearDate = new Date(currentDate);
	nextYearDate.setFullYear(currentDate.getFullYear() + 1); // Adds 1 year to the curent year
	const formattedDate = nextYearDate.toLocaleDateString();
	const router = useRouter();
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showAd, setShowAd] = useState(false);
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const handleProceedToCheckout = async () => {
      await AsyncStorage.setItem(`isSubscribed_${userId}`, 'true');
      setIsSubscribed(true);
      setShowAd(false);};
	return (
		<View className="flex-1 bg-[#F2f9FB] p-6 ">
			{/* Premium Header */}
			<View style={styles.header}>
					{/* Back Button */}
					<TouchableOpacity
						onPress={() => router.push("/(userTabs)/home")}
						style={styles.backButton}
					>
						<Icon
							name="arrow-left"
							size={20}
							color="#202A44"
						/>
					</TouchableOpacity>
					<Text className="text-2xl font-bold text-[#202A44] mb-1 mt-7 ml-10">
				Premium InfraSmart
			</Text>
				</View>
			

			{/* Plan Renewal Card */}
			<View className="bg-white p-4 rounded-xl shadow-md mb-6 mt-24">
				<Text className="text-lg font-semibold text-[#202A44]">
					Your plan will automatically renew on {formattedDate}.
				</Text>
				<Text className="text-lg text-gray-600">
					You will be charged R99/year.
				</Text>
			</View>

			{/* Benefits Card */}
			<View className="bg-white p-4 rounded-xl shadow-md mb-6">
				<Text className="text-lg font-bold text-[#202A44] mb-4">
					You will get access to premium features, including:
				</Text>
				<Text className="text-gray-600 mb-2">- 24/7 support </Text>
				<Text className="text-gray-600 mb-2">
					- Priority access to the app without ads
				</Text>
				<Text className="text-gray-600 mb-2">
					- 1 verified premium account
				</Text>
				<Text className="text-gray-600">- Cancel anytime</Text>
			</View>

			{/* Proceed to Checkout Button */}
			<Link
				href={{
					pathname: "/(payment)/pay",
					params: { amount: 99 },
				}}
				asChild
			>
				<TouchableOpacity className="bg-[#202A44] text-white font-bold py-3 px-6 rounded-lg mb-4">
					<Text className="text-white text-lg text-center">
						Proceed To Payment
					</Text>
				</TouchableOpacity>
			</Link>

			<Link
				href="/(payment)/"
				asChild
			>
				<TouchableOpacity className="bg-[#202A44] text-white font-bold py-3 px-6 rounded-lg mb-4">
					<Text className="text-white text-lg text-center">
						Donate instead
					</Text>
				</TouchableOpacity>
			</Link>

			{/* Cancel Button */}
			<TouchableOpacity
				onPress={() => router.back()}
				className="bg-gray-200 text-[#202A44] py-3 px-6 rounded-lg"
			>
				<Text className="text-[#202A44] text-lg text-center">
					Cancel
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Index;

const styles = StyleSheet.create({
	header: {
		position: "absolute",
		left: 0,
		right: 0,
		flexDirection: "row",
		alignContent: "space-between",
		alignItems: "center",
		padding: 20,
		zIndex: 10,
		backgroundColor: "#fff",
		height: 110,
		borderBlockEndColor: "#ccc",
	},
	backButton: {
		padding: 10,
		marginRight: 10,
		marginTop: 23
	},
})
