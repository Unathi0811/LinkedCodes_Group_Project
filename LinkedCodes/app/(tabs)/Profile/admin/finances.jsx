import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUser  } from "../../../../src/cxt/user";
import { usePayments } from "../../../../src/cxt/pay"; // Adjust the import path accordingly

const Finances = () => {
  const { user } = useUser ();
  const { payments, loading } = usePayments(); // Use the context to get payments and loading state

  // Calculate total revenue
  const totalRevenue = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  if (loading) {
    return (
      <>
        <ActivityIndicator size="large" color="#202A44" style={{
          flex: 1
        }}/>
      </>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {payments.map((payment) => (
          <View key={payment.id} style={styles.paymentRow}>
            <Text style={styles.userText}>{user.username}</Text>
            <Text style={styles.amountText}>${payment.amount}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total Revenue:</Text>
          <Text style={styles.totalAmount}>${totalRevenue}</Text>
        </View>
      </View>
    </View>
  );
};

export default Finances;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2f9FB",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#202A44",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  userText: {
    fontSize: 16,
    color: "#202A44",
  },
  amountText: {
    fontSize: 16,
    color: "#202A44",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202A44",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202A44",
  },
});