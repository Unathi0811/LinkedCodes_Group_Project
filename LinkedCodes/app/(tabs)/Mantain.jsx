import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Mantain = () => {
  return (
    <View>
      <Text>Mantain</Text>

      <Pressable onPress={() => signOut(auth)}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Mantain;

const styles = StyleSheet.create({});
