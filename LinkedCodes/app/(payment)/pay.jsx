import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ozow, PaymentLink } from "react-native-ozow"; // Ensure this import matches your package structure
import { Link, router, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import { auth } from "../../firebase";
import { useUser  } from "../../src/cxt/user";

const PaymentScreen = () => {
  const { amount } = useLocalSearchParams();
  const { user, setUser  } = useUser ();
  const [link, setLink] = useState("");

  const myLink = new PaymentLink("9219958c9f524a3da49fe518abb0de0b", "f276b028558946308361979e4bf88ffa");

  const handleGetPaymentLink = async () => {
    try {
      const results = await myLink.generateLink({
        SiteCode: "IPR-IPR-003",
        CountryCode: "ZA",
        CurrencyCode: "ZAR",
        Amount: +amount || 10, // Use amount from params or default to 10
        TransactionReference: `${auth.currentUser.uid}-${Date.now()}`,
        BankReference: +amount === 99 ? "InfraSmart-Premium" : "InfraSmart-Donation",
        CancelUrl: "https://www.ozow.com",
        ErrorUrl: "https://www.ozow.com",
        SuccessUrl: "https://www.ozow.com",
        NotifyUrl: "https://www.ozow.com",
        IsTest: false,
        Customer: auth.currentUser .email,
      });

      console.log("Visit: ", results);
      setLink(results.url);
    } catch (error) {
      console.log("Error generating payment link: ", error);
      Alert.alert("Error", "Failed to generate payment link.");
    }
  };

  const handlePaymentSuccess = (data) => {
    Alert.alert("Payment Success", "Payment was successful");
    const routeTo = user.userType === true ? "/(tabs)/Home/" : "/(userTabs)/home/";
    router.push(routeTo);
  };

  const handlePaymentCancel = (data) => {
    Alert.alert("Payment Cancelled", "Payment was cancelled");
    const routeTo = user.userType === true ? "/(tabs)/Home/" : "/(userTabs)/home/";
    router.push(routeTo);
  };

  const handleErrorMessage = (data) => {
    console.log("this is the data, unathi!", data);
    const message = data.Message || "An unknown error occurred";
    Alert.alert("Error", message);
    const routeTo = user.userType === true ? "/(tabs)/Home/" : "/(userTabs)/home/";
    router.push(routeTo);
  };

  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Button title="Confirm Payment" onPress={handleGetPaymentLink} />
        {link ? (
          <View style={{ paddingTop: 20 }}>
            <Text styles={{
				fontSize: 16,
				fontWeight: 'bold',
				color: "#202A44"
			}}>Payment Link: {link}</Text>
            <Ozow
              data={{
                SiteCode: "IPR-IPR-003",
                CountryCode: "ZA",
                CurrencyCode: "ZAR",
                Amount: +amount || 100, // Default amount
                TransactionReference:` ${auth.currentUser.uid}-${Date.now()}`,
                BankReference: +amount === 99 ? "InfraSmart-Premium" : "InfraSmart-Donation",
                CancelUrl: "https://www.ozow.com",
                ErrorUrl: "https://www.ozow.com",
                SuccessUrl: "https://www.ozow.com",
                NotifyUrl: "https://www.ozow.com",
                IsTest: false,
                Customer: auth.currentUser .email,
              }}
              privateKey="f276b028558946308361979e4bf88ffa"
              onErrorMessage={handleErrorMessage}
              onPaymentCancel={handlePaymentCancel}
              onPaymentSuccess={handlePaymentSuccess}
              style={styles.ozowStyle}
            />
          </View>
        ) : (
          <Text style={styles .subtitle}>Please generate a payment link first.</Text>
        )}
      </View>
    </>
  );
};

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
  ozowStyle: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default PaymentScreen;