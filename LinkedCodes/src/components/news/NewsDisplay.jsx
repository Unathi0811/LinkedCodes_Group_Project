import {
  View,
  Text,
  Image,
  FlatList,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NewsFromGoogleSerpApi } from "./News";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
const NewsDisplay = () => {
  const [news, setNews] = useState([]);
  const [error, setErrors] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const GettingNews = async () => {
      try {
        const FromGoogleSerpApi = await NewsFromGoogleSerpApi();
        // to filter the news, for the purpose of getting the ones related to traffic
        const filteredNews = FromGoogleSerpApi.filter(
          (item) =>
            item.title.toLowerCase().includes("traffic") ||
            item.title.toLowerCase().includes("road") ||
            item.title.toLowerCase().includes("roadblock") ||
            item.title.toLowerCase().includes("South africa") ||
            item.title.toLowerCase().includes("crash")
        );

        // for Sortering the filtered news by date
        const sortedNews = filteredNews.sort((a, b) => {
          const dateA = new Date(a.date.replace(/, \+0000 UTC/, " GMT"));
          const dateB = new Date(b.date.replace(/, \+0000 UTC/, " GMT"));
          return dateA - dateB; // to Sort them in descending order
        });

        setNews(sortedNews);
      } catch (error) {
        setErrors(error.message);
      }
    };

    GettingNews();
  }, []);

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const renderItem = ({ item }) => {
    const dateString = item.date;

    return (
      <View
        style={{
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "black",
          backgroundColor: "#F2f9FB",
          borderRadius: 5,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          {item.title}
        </Text>
        {item.thumbnail && (
          <Image
            source={{ uri: item.thumbnail, cache: "force-cache" }}
            style={{
              width: "100%",
              height: 200,
              marginBottom: 10,
              borderRadius: 9,
            }}
          />
        )}
        <Text
          style={{
            fontSize: 16,
            color: "black",
            fontStyle: "italic",
            fontWeight: "bold",
          }}
        >
          By {item.author?.name || "Unknown"} from{" "}
          {item.source?.name || "Unknown"}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "black",
            fontStyle: "italic",
            marginBottom: 5,
          }}
        >
          Published on: {dateString}
        </Text>
        <Text
          style={{ fontSize: 14, color: "blue", marginBottom: 5 }}
          onPress={() => Linking.openURL(item.link)}
        >
          Click to read more....
        </Text>
      </View>
    );
  };

  const handleButton = () => {
    router.push("/src/component/chatBot/ChatBot");
  };

  return (
    <View style={{ height: "80%" }}>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.link}
      />

      <Link asChild href="/(userTabs)/home/ChatBot">
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 33,
            right: 4,
            backgroundColor: "#202A44",
            borderRadius: 25,
            padding: 10,
            elevation: 5,
            height: 50,
            width: 50,
          }}
          // onPress={handleButton}
        >
          <Text
            style={{
              fontSize: 40,
              color: "white",
              position: "static",
              marginBottom: -3,
            }}
          >
			<Icon 
				name="robot"
				size={24}
				color="#F2f9FB"
			/>
		  </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default NewsDisplay;
