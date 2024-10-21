import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Steps, StepsProvider, useSteps } from "react-step-builder";
import { Link, router } from "expo-router";

// Square component for pagination dots
const Square = ({ isLight, selected }) => {
  let backgroundColor = selected ? "#202A44" : "rgba(0, 0, 0, 0.3)";
  return (
    <View
      style={{
        width: 8,
        height: 8,
        marginHorizontal: 3,
        backgroundColor,
        borderRadius: 4,
      }}
    />
  );
};

const buttonStyle = {
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  width: "80%",
  padding: 15,
  marginTop: 10,
};

const textStyle = {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
};

const Done = () => {
  return (
    <Link asChild href="/login">
      <TouchableOpacity style={[buttonStyle, { backgroundColor: "#202A44" }]}>
        <Text style={textStyle}>Get Started</Text>
      </TouchableOpacity>
    </Link>
  );
};

const Onboarding = ({ children, data: { image, title, subtitle } }) => {
  const { next, prev, hasNext, current } = useSteps();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        gap: 20,
      }}
    >
      <Image
        style={styles.image}
        source={image}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={{ flexDirection: "row", marginTop: 30 }}>
        <Square selected={current === 1} />
        <Square selected={current === 2} />
        <Square selected={current === 3} />
        <Square selected={current === 4} />
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            hasNext ? next() : router.push("/login");
          }}
          style={[buttonStyle, { backgroundColor: "#202A44" }]}
        >
          <Text style={textStyle}>{hasNext ? "Next" : "Get Started"}</Text>
        </TouchableOpacity>

        <Link asChild href="/login">
          <TouchableOpacity
            style={[
              buttonStyle,
              {
                backgroundColor: "transparent",
                borderColor: "#202A44",
                borderWidth: 2,
                padding: 10,
              },
            ]}
          >
            <Text style={[textStyle, { color: "#202A44" }]}>Skip</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const OnboardingScreens = () => {
  return (
    <Steps>
      {screensData.map((data, index) => (
        <Onboarding key={index} data={data} />
      ))}
    </Steps>
  );
};

// Styles
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "40%",
    resizeMode: "contain",
    marginBottom: 20,
  },
  imageContainer: {
    paddingBottom: 0,
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 30,
    backgroundColor: "F2f9FB",
  },
  title: {
    color: "#202A44",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#7D7D7D",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 15,
  },
});

export default () => {
  return (
    <StepsProvider>
      <OnboardingScreens />
    </StepsProvider>
  );
};

const screensData = [
  {
    image: require("../../assets/welcome.png"),
    title: "Welcome to InfraSmart",
    subtitle:
      "Revolutionizing infrastructure management with cutting-edge technology. Manage roads, bridges, and public facilities like never before.",
  },
  {
    image: require("../../assets/monitoring.png"),
    title: "Monitoring",
    subtitle:
      "Get live updates on road conditions, traffic, and more with our advanced sensor technology. Stay informed and proactive.",
  },
  {
    image: require("../../assets/maintain.png"),
    title: "Maintenance",
    subtitle:
      "Analyze data to predict when repairs are needed. Schedule maintenance before issues become critical and keep your infrastructure in top shape.",
  },
  {
    image: require("../../assets/report.png"),
    title: "Reporting",
    subtitle:
      "Report issues directly through the app with photos and descriptions. Track maintenance tasks and view trends with our analytics dashboard.",
  },
];
