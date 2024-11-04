import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Modal
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store"; // Import SecureStore
import AsyncStorage from "@react-native-async-storage/async-storage";
import logAudit from "../../services/auditlogFunction";

const AlertModal = ({ visible, title, message, buttonText, onButtonPress }) => {
  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.BioContainer}>
        <View style={styles.BioContent}>
          <Text style={styles.BioTitle}>{title}</Text>
          <Text style={styles.BioMessage}>{message}</Text>
          <TouchableOpacity onPress={onButtonPress} style={styles.BioButton}>
            <Text style={styles.BioText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isBiometricSupported, setBiometricSupported] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state
  const [userSession, setUserSession] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState('');
  const [modalBioVisible, setModalBioVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', buttonText: '', onButtonPress: () => {} });


  const fallBackToDefaultAuth = () => {
    console.log("Fallback to password authentication");
  };

  const showModal = (title, message, buttonText, onButtonPress) => {
    setModalContent({ title, message, buttonText, onButtonPress });
    setModalBioVisible(true);
  };

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isBiometricAvailable) {
      return showModal(
        "Biometric Authentication Not Supported",
        "Please login with your password.",
        "OK",
        fallBackToDefaultAuth
      );
    }

    const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isBiometricEnrolled) {
      return showModal(
        "No Biometric Record Found",
        "Please login with your password.",
        "OK",
        fallBackToDefaultAuth
      );
    }

    // Check if biometric authentication is enabled in settings
    const biometricEnabled = await AsyncStorage.getItem("biometricEnabled");
    const parsedBiometricEnabled = biometricEnabled
      ? JSON.parse(biometricEnabled)
      : { faceId: false, fingerprint: false };

    // Check if any biometric type is enabled
    if (!parsedBiometricEnabled.faceId && !parsedBiometricEnabled.fingerprint) {
      return showModal(
        "Biometric Authentication Disabled",
        "Please enable biometric authentication in settings.",
        "OK",
        fallBackToDefaultAuth
      );
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login using Biometrics",
      cancelLabel: "Cancel",
    });


    if (biometricAuth.success) {
      // Retrieve the last logged-in user's email from SecureStore
      const storedEmail = await SecureStore.getItemAsync("user_email");
      const storedPassword = await SecureStore.getItemAsync("user_password");

      if (storedEmail && storedPassword) {
        signInWithEmailAndPassword(getAuth(), storedEmail, storedPassword)
          .then(() => {
            // router.push("/(userTabs)/home");
          })
          .catch((err) => {
            Alert.alert(err?.message);
          });
      } else {
        showModal(
          "Biometric authentication not set up",
          "Please log in using your password, and set up biometrics",
          "OK",
          fallBackToDefaultAuth
        );
      }
    } else {
      showModal(
        "Authentication Failed",
        "Please try again or login with your password.",
        "OK",
        fallBackToDefaultAuth
      );
    }
  };
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setBiometricSupported(compatible);
    })();
  }, []);

  const handleLogin = async () => {
    if (email === "" || password === "") {
      setModalMessage('Please fill in all fields.');
			setModalVisible(true);
        return;
    }
    setLoading(true); // Start loading
    try {
        const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
        const user = userCredential.user;

        await SecureStore.setItemAsync("user_email", email)
        await SecureStore.setItemAsync("user_password", password);

        // Log the login action in the audit logs
        logAudit(
            email, // Email of the user
            null, // No error message
            user.uid, // User ID
            "User  Login",
            user.uid, // User ID again for consistency
            "127.0.0.1", // Example IP, replace with actual if available
            "User  logged in successfully",
            "success" // Status of the action
        );

        // Redirect to the home screen
        // router.push("/(userTabs)/home");
    } catch (error) {
        console.error("Error logging in user: ", error);
        Alert.alert(error.message);

        // Log the error in the audit logs
        logAudit(
            email, // Email of the user
            error.message, // Error message
            null, // No user ID since login failed
            "User  Login Failed",
            null, // No user ID since login failed
            "127.0.0.1", // Example IP, replace with actual if available
            "Failed login attempt",
            "failure" // Status of the action
        );
    } finally {
        setLoading(false); // Stop loading
    }
};

const handleCloseModal = () => {
  setModalVisible(false);
};

  return (
    <View style={styles.container}>
      <View style={styles.helloContainer}>
        <Text style={styles.hello}>Hello</Text>
      </View>

      <AlertModal
        visible={modalBioVisible}
        title={modalContent.title}
        message={modalContent.message}
        buttonText={modalContent.buttonText}
        onButtonPress={() => {
          modalContent.onButtonPress();
          setModalBioVisible(false);
        }}
      />

      <View>
        <Text style={styles.loginText}>Sign in to your account</Text>
      </View>

      <Text style={styles.labelText}>Email</Text>
      <View style={styles.inputContainer}>
        <Icon name={"user"} size={24} color={"#ccc"} style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          autoComplete="email"
          placeholderTextColor={"#ccc"}
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
          placeholderTextColor={"#ccc"}
          placeholder="password"
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity
        style={styles.signInButtonContainer}
        onPress={handleLogin}
      >
        <Text style={styles.signIn}>{loading ? "Loading..." : "Sign In"}</Text>
      </TouchableOpacity>

      {/* Biometric Login Button */}
      {isBiometricSupported && (
        <TouchableOpacity
          style={styles.biometricButton}
          onPress={handleBiometricAuth}
        >
          <Text style={styles.biometricText}>Use Biometrics</Text>
        </TouchableOpacity>
      )}

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
            Don't have account?
            <Text style={styles.createText}>Create</Text>
          </Text>
        </TouchableOpacity>
      </Link>

      <Modal
				transparent
				visible={modalVisible}
				animationType="slide"
			>
				<View style={styles.overlay}>
				<View style={styles.modalContent}>
					<Icon
						name="exclamation"
						size={30}
						color="#202A44"
					style={{marginBottom:30}}
					/>
					<Text style={styles.message}>{modalMessage}</Text>
					<TouchableOpacity
						style={styles.OKButton}
						onPress={handleCloseModal}
					>
					<Text style={styles.btnText}> OK </Text>
					</TouchableOpacity>
				</View>
				</View>
			</Modal>
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
  labelText: {
    marginLeft: 50,
    color: "#202A44",
  },
  helloContainer: {
    marginTop: 120,
    marginBottom: 0,
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
    marginBottom: 70,
  },
  inputContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    borderRadius: 10,
    marginHorizontal: 40,
    elevation: 10,
    marginVertical: 10,
    borderColor: "#ccc",
    height: 50,
    borderWidth: 1,
    alignItems: "center",
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.1,
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
  biometricButton: {
    backgroundColor: "#202A44",
    borderRadius: 10,
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
  biometricText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
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
    borderRadius: 10,
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
  signUp: {
    color: "#BEBEBE",
    textAlign: "right",
    fontSize: 15,
    width: "87%",
    marginTop: 23,
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
    marginLeft: -23,
    marginTop: 56,
  },

  
	overlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: 300,
		padding: 20,
		backgroundColor: '#F2f9FB',
		borderRadius: 10,
		alignItems: 'center',
		height: 250,
		justifyContent: 'center',
    alignItems: 'center',
	},
	message: {
		marginBottom: 50,
		fontSize: 20,
	},
	btnText: {
		color: '#F2f9FB',
		fontWeight: 'bold',
		fontSize: 20,
	},
	OKButton: {
		padding: 10,
		alignItems: 'center',
		backgroundColor: '#202A44',
		borderRadius: 5,
		marginLeft: 5,
	},

  // Biomatrics 
  BioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  BioContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#F2f9FB',
    borderRadius: 10,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center'
  },
  BioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  BioMessage: {
    textAlign: 'center',
    marginBottom: 50,
    marginBottom: 20,
  },
  BioButton: {
    padding: 10,
		alignItems: 'center',
		backgroundColor: '#202A44',
		borderRadius: 5,
		marginLeft: 5,
  },
  BioText: {
    color: '#F2f9FB',
		fontWeight: 'bold',
		fontSize: 20,
  },
});