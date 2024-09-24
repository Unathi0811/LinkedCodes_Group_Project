import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

const traffic = () => {
  return (
    <View>
      <Text>traffic</Text>
      <Pressable
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
        onPress={() => signOut(auth)}
      >
        <Text style={styles.cardText}>Logout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#F5F5F5",
    backgroundColor: "#fff",
    position: "relative",
  },
  createAccountText: {
    fontSize: 28,
    color: "#202A44",
    textAlign: "center",
    marginBottom: 0,
    fontWeight: "bold",
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 10,
    height: 50,
    alignItems: "center",
    shadowOffset: { width: 3, height: 10 },
    shadowOpacity: 0.2,
    shadowColor: "#202A44",
    gap: 10,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  socialText: {
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  socialIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    paddingHorizontal: 60,
  },
  pressedSocial: {
    margin: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowColor: "#202A44",
    shadowRadius: 10,
    elevation: 5,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  signUpButtonContainer: {
    backgroundColor: "#202A44",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 3, height: 10 },
    shadowOpacity: 0.2,
    shadowColor: "#202A44",
  },
  signUp: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  gradient: {
    height: 34,
    width: 66,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  topImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    marginBottom: 0,
    marginLeft: -29,
    marginTop: 0,
  },
  bottomImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    marginLeft: -44,
    marginTop: 30,
  },
});

export default traffic;