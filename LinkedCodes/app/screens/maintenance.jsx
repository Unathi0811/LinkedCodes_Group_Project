import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const Maintenance = () => {
  const handleMenuPress = () => {
    //what happens when the hamburger is pressed
    console.log("Hamburger menu pressed");
  };
  return (
    <View>
      <View style={styles.headerContainer}>
          <TouchableOpacity
          onPress={handleMenuPress}
          style={styles.hamburgerButton}
          >
          <Icon name="bars" size={24} color="#000" />
          </TouchableOpacity>
      </View>

      {/* analysis graph or images */}
      {/* prediction of bridges */}
      {/* analysis graph or images */}
      {/* prediction of roads */}
      {/* calendar */}
    </View>
  )
}

export default Maintenance

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
  },
})