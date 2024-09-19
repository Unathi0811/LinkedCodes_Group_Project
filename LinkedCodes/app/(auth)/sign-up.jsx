import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Pressable,
  Keyboard,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "react-native-vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth , db} from "../../firebase";

const SignupScreen = () => {
  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
    email: "",
    mobile: "",
  });

  const handleSignUp = () => {
    const { username, password, email, mobile } = userData;
    if (!username || !password || !email || !mobile) {
      Alert.alert("Please fill in all fields");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "user", user.uid), {
          username,
          email,
          mobile,
          userType: false,
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert(errorMessage);
      });

    setUserData({ username: "", password: "", email: "", mobile: "" });
  };

  return (
    //a useContext that will take evrything heare and store them in the users profile
    <Pressable onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/top.png")} style={styles.topImage} />
      </View>
      <View>
        <Text style={styles.createAccountText}>Create Account</Text>
      </View>

      <View style={styles.inputContainer}>
        <Icon name={"briefcase"} size={20} color={"#ccc"} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Department"
          keyboardType="default"
          autoComplete="nickname"
          onChangeText={(text) => setUserData({ ...userData, username: text })}
          value={userData.username}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name={"mobile"}
          size={24}
          color={"#ccc"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Mobile"
          onChangeText={(text) => setUserData({ ...userData, mobile: text })}
          value={userData.mobile}
          keyboardType="phone-pad"
          autoComplete="tel"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon
          name={"envelope"}
          size={24}
          color={"#ccc"}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          value={userData.email}
          keyboardType="email-address"
          autoComplete="email"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name={"lock"} size={24} color={"#ccc"} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          keyboardType="default"
          autoComplete="new-password"
          secureTextEntry={true}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
          value={userData.password}
        />
      </View>

      {/* this touchabale should have 3 tasks 
      1) takes to the home screen
      2) saves the data to the local storage 
      3) and  think use useContext to display the data in profile
      */}
      <TouchableOpacity
        style={styles.signUpButtonContainer}
        onPress={handleSignUp}
      >
        <Text style={styles.signUp}>Sign Up</Text>
      </TouchableOpacity>

      {/* The idea here is to allow one to be able to sign in using their facebook, google and apple ID, by face or fingerprint if one is using an android */}
      <View style={styles.socialMediaContainer}>
        <Text style={styles.socialText}>
          Or create account using social media
        </Text>
        <View style={styles.socialIconsContainer}>
          <TouchableOpacity
            style={styles.pressedSocial}
            onPress={() => console.log("Facebook pressed")}
          >
            <Image
              source={require("../../assets/facebook.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pressedSocial}
            onPress={() => console.log("google pressed")}
          >
            <Image
              source={require("../../assets/google.png")}
              style={styles.iconImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require("../../assets/bottom.png")} style={styles.bottomImage} />
      </View>
    </Pressable>
  );
};

export default SignupScreen;

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
    marginLeft: -44,
    marginTop: 30,
  },
});
