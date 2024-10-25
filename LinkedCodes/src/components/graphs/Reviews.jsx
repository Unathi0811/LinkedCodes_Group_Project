import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

const ReviewsAnalytics = () => {
  const [data, setData] = useState([
    { value: 0, label: 1 },
    { value: 0, label: 2 },
    { value: 0, label: 3 },
    { value: 0, label: 4 },
    { value: 0, label: 5 },
  ]);
  const [avg, setAvg] = useState(0)

  useEffect(() => {
    const q = query(collection(db, "reviews"), where("rating", "==", 1));
    const q1 = query(collection(db, "reviews"), where("rating", "==", 2));
    const q2 = query(collection(db, "reviews"), where("rating", "==", 3));
    const q3 = query(collection(db, "reviews"), where("rating", "==", 4));
    const q4 = query(collection(db, "reviews"), where("rating", "==", 5));

    getDocs(q).then((snapshot) => {
      const arr = [...data];
      arr[0].value = snapshot.size;
      setData(arr);
    });
    getDocs(q1).then((snapshot) => {
      const arr = [...data];
      arr[1].value = snapshot.size;
      setData(arr);
    });
    getDocs(q2).then((snapshot) => {
      const arr = [...data];
      arr[2].value = snapshot.size;
      setData(arr);
    });
    getDocs(q3).then((snapshot) => {
      const arr = [...data];
      arr[3].value = snapshot.size;
      setData(arr);
    });
    getDocs(q4).then((snapshot) => {
      const arr = [...data];
      arr[4].value = snapshot.size;
      setData(arr);
    });
  }, []);

  useEffect(() => {
    const q = query(collection(db, "reviews"));

    getDocs(q).then((snapshot) => {
      const sum = snapshot.docs.reduce((acc, doc) => acc + doc.data().rating, 0)
      const avg = sum / snapshot.docs.length  
      setAvg(avg)
    });
  
    return () => {
      
    }
  }, [])
  

  return (
    <View
      style={{
        backgroundColor: "#F5FCFF",
      }}
    >
      <Text>
        Ratings Analysis
      </Text>
      <Text>
       Avarage: {avg}
      </Text>
      <BarChart data={data} />
    </View>
  );
};

export default ReviewsAnalytics;

const styles = StyleSheet.create({});
