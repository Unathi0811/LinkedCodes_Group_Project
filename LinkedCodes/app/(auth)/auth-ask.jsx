import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const Gov_User_screen = ({ navigation }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Image 
          style={styles.logo}
            source={require('../../assets/logo.png')}
          />
          <Link href="/login" asChild>
            <TouchableOpacity
              style={styles.button}
            >
              <Text style={styles.buttonText}>Government</Text>
            </TouchableOpacity>
          </Link>
          {/* login kelly */}
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Citizen</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
};

export default Gov_User_screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 74,
    marginTop: -34,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#202A44",
    borderRadius: 20,
    height: 50,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 3, height: 10 },
    shadowOpacity: 0.1,
    shadowColor: "#000",
    marginBottom: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
