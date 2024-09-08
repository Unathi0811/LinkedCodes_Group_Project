import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";

const Square = ({ isLight, selected }) => {
  let backgroundColor;
  if (isLight) {
    backgroundColor = selected ? "#3A5CAD" : "rgba(0, 0, 0, 0.3)";
  } else {
    backgroundColor = selected ? "#fff" : "#3A5CAD";
  }
  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const buttonStyle = {
  borderRadius: 25,
  alignItems: "center",
  justifyContent: "center",
  marginVertical: 10,
  width: 150,
};

const textStyle = {
  color: "#3A5CAD",
  fontSize: 16,
  fontWeight: "bold",
};

const Done = () => {
  return (
    <Link asChild href="/auth-ask"> 
      <TouchableOpacity
        style={buttonStyle}
        // onPress={() => navigation.navigate("Gov_User_screen")}
      >
        <Text style={textStyle}>Get Started</Text>
      </TouchableOpacity>
    </Link>
  );
};

const Next = (props) => (
  <TouchableOpacity style={buttonStyle} {...props}>
    <Text style={textStyle}>Next</Text>
  </TouchableOpacity>
);

const OnboardingScreens = () => {
  return (
    <Onboarding
      DotComponent={Square}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      showSkip={false}
      titleStyles={{ color: "#3A5CAD" }}
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.image}
              source={require("../../assets/maintenance.png")}
            />
          ),
          title: "Welcome to InfraSmart",
          subtitle:
            "Revolutionizing infrastructure management with cutting-edge technology. Manage roads, bridges, and public facilities like never before.",
          titleStyles: { color: "#3A5CAD" },
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.image}
              source={require("../../assets/analytics.png")}
            />
          ),
          title: "Real-Time Monitoring",
          subtitle:
            "Get live updates on road conditions, traffic, and more with our advanced sensor technology. Stay informed and proactive.",
          titleStyles: { color: "#3A5CAD" },
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.image}
              source={require("../../assets/prediction.png")}
            />
          ),
          title: "Predictive Maintenance",
          subtitle:
            "Analyze data to predict when repairs are needed. Schedule maintenance before issues become critical and keep your infrastructure in top shape.",
          titleStyles: { color: "#3A5CAD" },
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.image}
              source={require("../../assets/reporting.png")}
            />
          ),
          title: "Instant Incident Reporting",
          subtitle:
            "Report issues directly through the app with photos and descriptions. Track maintenance tasks and view trends with our analytics dashboard.",
          titleStyles: { color: "#3A5CAD" },
        },
      ]}
    />
  );
};

export default OnboardingScreens;

const styles = StyleSheet.create({
  image: {
    width: 230,
    height: 230,
  },
});
