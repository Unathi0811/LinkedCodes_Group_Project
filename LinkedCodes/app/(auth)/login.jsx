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
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/top.png")} style={styles.topImage} />
      </View>
      <View style={styles.helloContainer}>
        <Text style={styles.hello}>Hello</Text>
      </View>

      <View>
        <Text style={styles.loginText}>Sign in to your account</Text>
      </View>

      <Text  style={styles.labelText}>Email</Text>
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

      <Text style={styles.labelText}>Password</Text>
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

       {/* The sign in button needs to go home */}
      <TouchableOpacity
        style={styles.signInButtonContainer}
        onPress={handleLogin}
      >
        <Text style={styles.signIn}>Sign In</Text>
      </TouchableOpacity>

      <Link href="/forgot-password" asChild>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>
            Forgot your password? <Text style={styles.createText}>Reset</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      <Link href="/sign-up" asChild>
        <TouchableOpacity>
          <Text style={styles.signUp}>
            Don't have account? <Text style={styles.createText}>Create</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      <View style={styles.imageContainer}>
        <Image source={require("../../assets/bottom.png")} style={styles.bottomImage} />
      </View>
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
  labelText:{
    marginLeft: 50,
    color: "#202A44",
  },
  helloContainer: {
    marginTop: 0,
  },
  hello: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "400",
    color: "#202A44",
  },
  loginText: {
    textAlign: "center",
    fontSize: 18,
    color: "#202A44",
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
    shadowOpacity: 0.2,
    shadowColor: "#202A44",
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
    marginTop: 23,
  },
  signInButtonContainer: {
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
  signIn: {
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
  signUp: {
    color: "#BEBEBE",
    textAlign: "center",
    fontSize: 15,
    marginTop: 22,
    marginLeft: 33,
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
  topImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    marginBottom: 0,
    marginLeft: -29,
    marginTop: 0,
  },
  
  bottomImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    marginLeft: -23,
    marginTop: 56,
  },
});
