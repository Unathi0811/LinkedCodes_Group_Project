import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
// import AntDesign from "react-native-vector-icons/AntDesign
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "react-native-vector-icons";
import { Link } from "expo-router";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    if (email === "" || password === "") {
      alert("Please fill in all fields");
      return;
    }

    signInWithEmailAndPassword(getAuth(), email, password)
      .then(() => {})
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topImageContainer}>
        <Image
          source={require("../../assets/Vector_1.png")}
          style={styles.topImage}
        />
      </View>

      <View style={styles.helloContainer}>
        <Text style={styles.hello}>Hello</Text>
      </View>

      <View>
        <Text style={styles.loginText}>Sign in to your account</Text>
      </View>

      <View style={styles.inputContainer}>
        <Icon name={"user"} size={24} color={"#ccc"} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoComplete="email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name={"lock"} size={24} color={"#ccc"} style={styles.inputIcon} />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          autoComplete="password"
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>

      <Link href="/forgot-password" asChild>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>
            Forgot your password? <Text style={styles.createText}>Reset</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      {/* The sign in button needs to go home */}

      <TouchableOpacity
        style={styles.signInButtonContainer}
        onPress={handleLogin}
      >
        <Text style={styles.signIn}>Sign In</Text>
        <LinearGradient colors={["#E5C200", "#3A5CAD"]} style={styles.gradient}>
          <MaterialIcons name="arrow-forward" size={24} color="#000" />
        </LinearGradient>
      </TouchableOpacity>

      <Link href="/sign-up" asChild>
        <TouchableOpacity>
          <Text style={styles.signUp}>
            Don't have account? <Text style={styles.createText}>Create</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.leftVectorContainer}>
        <Image
          source={require("../../assets/Vector_2.png")}
          style={styles.leftImage}
        />
      </View>
      {/* <LinearGradient
                colors={["#FFFFFF", "#FFE998"]}
                style={styles.linearGradient}
            >
                <Text style={styles.buttonText}>Sign in with Facebook</Text>
            </LinearGradient> */}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#F5F5F5",
    backgroundColor: "#fff",
    position: "relative",
  },
  topImageContainer: {
    height: 50,
  },
  topImage: {
    width: "100%",
    height: 150,
  },
  helloContainer: {
    marginTop: 79,
  },
  hello: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "400",
    color: "#000",
  },
  loginText: {
    textAlign: "center",
    fontSize: 18,
    color: "#262626",
    fontWeight: "200",
    marginBottom: 20,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    borderRadius: 20,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 20,
    height: 50,
    alignItems: "center",
    shadowOffset: { width: 3, height: 10 },
    shadowOpacity: 0.1,
    shadowColor: "#000",
  },
  textInput: {
    flex: 1,
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  forgotPasswordText: {
    color: "#BEBEBE",
    textAlign: "right",
    fontSize: 15,
    width: "87%",
  },
  signInButtonContainer: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "center",
    width: "90%",
    justifyContent: "flex-end",
  },
  signIn: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  gradient: {
    height: 34,
    width: 66,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  signUp: {
    color: "#BEBEBE",
    textAlign: "center",
    fontSize: 13,
    marginTop: 50,
    marginLeft: 84,
  },
  createText: {
    textDecorationLine: "underline",
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent",
  },
  leftVectorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  leftImage: {
    width: 110,
    height: 300,
  },
});
