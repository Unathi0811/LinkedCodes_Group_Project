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
import Icon from "react-native-vector-icons/FontAwesome5";
import { Ozow } from "react-native-ozow";
import { auth } from "../../firebase";
import { useUser } from "../../src/cxt/user";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const PaymentScreen = () => {
  const { amount } = useLocalSearchParams();
  const { user, setUser } = useUser();

  console.log(auth.currentUser.uid, +amount);

  //make the three functions so that i can conditinally render or route
  const handlePaymentSuccess = async (data) => {
    Alert.alert("Payment Success", "Payment was successful");

    // Create a payment record
    const paymentData = {
      userId: auth.currentUser.uid,
      amount: +amount,
      transactionReference: `${auth.currentUser.uid}-${Date.now()}`,
      bankReference:
        +amount === 99 ? "InfraSmart-Premium" : "InfraSmart-Donation",
      customerEmail: auth.currentUser.email,
      timestamp: new Date(),
    };

    try {
      // Store the payment data in Firestor
      await addDoc(collection(db, "payments"), paymentData);
      console.log("Payment data stored successfully:", paymentData);
    } catch (error) {
      console.error("Error storing payment data: ", error);
      Alert.alert(
        "Error",
        "There was an issue storing your payment information."
      );
    }

    // Conditional routing based on userType
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
    Alert.alert("Error", data.Message);
    const routeTo = user.userType === true ? "/(tabs)/Home/" : "/(userTabs)/home/";
    router.push(routeTo);
  };

  return (
    <Ozow
      data={{
        SiteCode: "IPR-IPR-003",
        Amount: +amount,
        TransactionReference: `${auth.currentUser.uid}-${Date.now()}`,
        BankReference:
          +amount === 99 ? "InfraSmart-Premium" : "InfraSmart-Donation",
        Customer: auth.currentUser.email,
        CancelUrl: "https://ozow.com",
        ErrorUrl: "https://ozow.com",
        SuccessUrl: "https://ozow.com",
        NotifyUrl: "https://ozow.com",
        isTest: true
      }}
      privateKey="f276b028558946308361979e4bf88ffa"
      onErrorMessage={handleErrorMessage}
      onPaymentCancel={handlePaymentCancel}
      onPaymentSuccess={handlePaymentSuccess}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Payment Information</Text>
      <Text style={styles.subtitle}>
        Provide your card information to securely proceed with the donation.
      </Text>

      {/* Payment Method Selector */}
      <View style={styles.paymentMethodContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              paymentMethod === method.id && styles.selectedMethod,
            ]}
            onPress={() => setPaymentMethod(method.id)}
          >
            <Image source={method.image} style={styles.paymentIcon} />
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

      <Link href="/(payment)/confirm" asChild>
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
  paymentMethod: { alignItems: "center", padding: 10 },
  selectedMethod: { borderColor: "#202A44", borderWidth: 2, borderRadius: 10 },
  paymentIcon: { width: 50, height: 30, marginBottom: 5 },
  paymentLabel: { color: "#202A44", fontSize: 14 },
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
  row: { flexDirection: "row", justifyContent: "space-between", width: "80%" },
  halfInput: { width: "45%" },
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
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  icon: { marginLeft: 10 },
});
