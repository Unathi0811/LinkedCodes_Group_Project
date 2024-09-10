import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Calendar from "../components/Calender";

const Mantain = () => {
  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      <Calendar />
    </View>
  );
};

export default Mantain;

const styles = StyleSheet.create({});
