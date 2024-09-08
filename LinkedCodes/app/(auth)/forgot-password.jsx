import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { router } from "expo-router";

const ForgotPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Forgot Password</Text>
      <Pressable onPress={() => router.back()}>
        <Text>Go back</Text>
      </Pressable>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
