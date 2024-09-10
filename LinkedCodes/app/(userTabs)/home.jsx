import { View, Text, Pressable } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Home = () => {
  return (
    <View>
      <Text>Home</Text>
      <Pressable
        style={{
          padding: 10,
          borderRadius: 10,
        }}
        onPress={() => signOut(auth)}
      >
        <Text
          style={{
            color: "blue",
            fontSize: 16,
          }}
        >
          Logout
        </Text>
      </Pressable>
    </View>
  );
};

export default Home;
