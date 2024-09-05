import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from 'react-native-vector-icons';

const SignupScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
        <View style={styles.topImageContainer}>
            <Image
                source={require("../../../assets/Vector_1.png")}
                style={styles.topImage}
            />
        </View>

        <View>
            <Text style={styles.createAccountText}>Create Account</Text>
        </View>

        <View style={styles.inputContainer}>
            <Icon name={"user"} size={24} color={"#ccc"} style={styles.inputIcon} />
            <TextInput style={styles.textInput} placeholder="Username" />
        </View>

        <View style={styles.inputContainer}>
            <Icon name={"lock"} size={24} color={"#ccc"} style={styles.inputIcon} />
            <TextInput
                style={styles.textInput}
                placeholder="Password"
                secureTextEntry={true}
            />
        </View>

        <View style={styles.inputContainer}>
            <Icon name={"envelope"} size={24} color={"#ccc"} style={styles.inputIcon} />
            <TextInput style={styles.textInput} placeholder="Email" />
        </View>

        <View style={styles.inputContainer}>
            <Icon name={"mobile"} size={24} color={"#ccc"} style={styles.inputIcon} />
            <TextInput style={styles.textInput} placeholder="Mobile" />
        </View>

        <TouchableOpacity style={styles.signUpButtonContainer} onPress={() => navigation.navigate('HomeScreen')}>
            <Text style={styles.signUp}>Create</Text>
            <LinearGradient
                colors={["#E5C200", "#3A5CAD"]}
                style={styles.gradient}
            >
                <MaterialIcons name="arrow-forward" size={24} color="#000" />
            </LinearGradient>
        </TouchableOpacity>

        {/* The idea here is to allow one to be able to sign in using their facebook, google and apple ID, by face or fingerprint if one is using an android */}
        <View style={styles.socialMediaContainer}>
          <Text style={styles.socialText}>Or create account using social media</Text>
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity style={styles.pressedSocial} onPress={() => console.log('Facebook pressed')}>
              <Image source={require("../../../assets/facebook.png")} style={styles.iconImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressedSocial} onPress={() => console.log('google pressed')}>
              <Image source={require("../../../assets/google.png")} style={styles.iconImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pressedSocial} onPress={() => console.log('apple pressed')}>
              <Image source={require("../../../assets/apple.png")} style={styles.iconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.leftVectorContainer}>
            <Image 
                source={require("../../../assets/Vector_2.png")}
                style={styles.leftImage}
            />
        </View>
    </View>
  );
}

export default SignupScreen

const styles = StyleSheet.create({
  container: {
      flex: 1,
      color: "#F5F5F5",
      backgroundColor: "#fff",
      position: "relative",
  },
  createAccountText: {
    fontSize: 23,
    color: "#3A5CAD",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    marginTop: 90,
  },
  topImageContainer: {
      height: 50,
  },
  topImage: {
    width: "100%",
    height: 150,
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
  socialText: {
    color: "#000",
    textAlign: 'center',
    marginTop: 20, 
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    marginTop: 25, 
    paddingHorizontal: 60, 
  },
  pressedSocial: {
    margin: 10,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowColor: "#000", 
    shadowRadius: 10,
    elevation: 5,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  signUpButtonContainer: {
      flexDirection: "row",
      marginTop: 40,  
      justifyContent: "center",
      width: "90%",
      justifyContent: "flex-end",
  },
  signUp: {
      color: "#3A5CAD",
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
  leftVectorContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
  },
  leftImage: {
      width: 90,
      height: 230, 
      marginRight: 3,
  }
});
