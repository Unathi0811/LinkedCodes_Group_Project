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
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth, db } from "../../firebase";
import logAudit from "../../services/auditlogFunction";

const SignupScreen = () => {
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState({
		username: "",
		password: "",
		email: "",
		mobile: "",
	});

	const handleSignUp = async () => {
		const { username, password, email, mobile } = userData;
		if (!username || !password || !email || !mobile) {
			Alert.alert("Please fill in all fields");
			return;
		}
		setLoading(true);
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Save user data in Firestore
			await setDoc(doc(db, "user", user.uid), {
				username,
				email,
				mobile,
				userType: false,
			});

			// Log the sign-up action in the audit logs
			logAudit(
				email,
				null, // No error message
				user.uid,
				"User Sign-Up",
				user.uid,
				"127.0.0.1", // Example IP, replace with actual if available
				"User account created",
				"success"
			);
			setUserData({ username: "", password: "", email: "", mobile: "" });
			console.log("Audit log created successfully.");
		} catch (error) {
			console.error("Error signing up user: ", error);
			Alert.alert(error.message);

			// Log the error in the audit logs
			logAudit(
				email,
				error.message,
				null,
				"User Sign-Up Failed",
				null,
				"127.0.0.1",
				"Failed attempt",
				"failure"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		//a useContext that will take evrything heare and store them in the users profile
		<Pressable
			onPress={Keyboard.dismiss}
			style={styles.container}
		>
			<View>
				<Text style={styles.createAccountText}>Create Account</Text>
			</View>

			<Text style={styles.title}>Username: </Text>
			<View style={styles.inputContainer}>
				<Icon
					name={"user"}
					size={24}
					color={"#ccc"}
					style={styles.inputIcon}
				/>
				<TextInput
					style={styles.textInput}
					placeholder="username"
					keyboardType="default"
					placeholderTextColor={"#ccc"}
					autoComplete="nickname"
					onChangeText={(text) =>
						setUserData({ ...userData, username: text })
					}
					value={userData.username}
				/>
			</View>

			<Text style={styles.title}>Mobile: </Text>
			<View style={styles.inputContainer}>
				<Icon
					name={"mobile"}
					size={35}
					color={"#ccc"}
					style={styles.inputIcon}
				/>
				<TextInput
					style={styles.textInput}
					placeholder="mobile"
					onChangeText={(text) =>
						setUserData({ ...userData, mobile: text })
					}
					value={userData.mobile}
					keyboardType="phone-pad"
					placeholderTextColor={"#ccc"}
					autoComplete="tel"
				/>
			</View>

			<Text style={styles.title}>Email: </Text>
			<View style={styles.inputContainer}>
				<Icon
					name={"envelope"}
					size={20}
					color={"#ccc"}
					style={styles.inputIcon}
				/>
				<TextInput
					style={styles.textInput}
					placeholder="email"
					onChangeText={(text) =>
						setUserData({ ...userData, email: text })
					}
					value={userData.email}
					placeholderTextColor={"#ccc"}
					keyboardType="email-address"
					autoComplete="email"
				/>
			</View>

			<Text style={styles.title}>Password: </Text>
			<View style={styles.inputContainer}>
				<Icon
					name={"lock"}
					size={25}
					color={"#ccc"}
					style={styles.inputIcon}
				/>
				<TextInput
					style={styles.textInput}
					placeholder="password"
					placeholderTextColor={"#ccc"}
					keyboardType="default"
					autoComplete="new-password"
					secureTextEntry={true}
					onChangeText={(text) =>
						setUserData({ ...userData, password: text })
					}
					value={userData.password}
				/>
			</View>

			{/* this touchabale should have 3 tasks
      1) takes to the home screen
      2) saves the data to the local storage
      3) and  think use useContext to display the data in profile
      */}
			<TouchableOpacity
				style={[
					styles.signUpButtonContainer,
					loading
						? {
								opacity: 0.8,
						  }
						: {},
				]}
				onPress={handleSignUp}
			>
				<Text style={styles.signUp}>
					{loading ? "Loading..." : "Sign In"}
				</Text>
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
		marginBottom: 22,
		fontWeight: "bold",
		marginTop: 100,
	},
	inputContainer: {
		backgroundColor: "#ffffff",
		flexDirection: "row",
		borderRadius: 10,
		marginHorizontal: 40,
		elevation: 10,
		marginVertical: 10,
		height: 50,
		borderWidth: 1,
		borderColor: "#ccc",
		alignItems: "center",
		shadowOffset: { width: 4, height: 10 },
		shadowOpacity: 0.1,
		shadowColor: "#202A44",
		gap: 10,
		paddingHorizontal: 10,
	},
	title: {
		fontSize: 15,
		color: "#202A44",
		marginLeft: 56,
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
		shadowOpacity: 0.8,
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
});
