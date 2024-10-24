import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ReviewsAnalytics from "../../../src/components/graphs/Reviews";

const Analytics = () => {


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
      }}
    >
     <ReviewsAnalytics />
    </View>
  );
};

export default Analytics;

const styles = StyleSheet.create({});
