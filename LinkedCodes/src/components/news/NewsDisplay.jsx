import {
  View,
  Text,
  Image,
  FlatList,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Modal
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
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {  
    const GettingNews = async () => {  
      try {  
        const FromGoogleSerpApi = await NewsFromGoogleSerpApi();  
        const filterParams = {  
          keywords: [ 'traffic','roads','crash','traffic incident', 'traffic lights','road conditions'],  
          location: 'south africa',  
        };  
  
        // to filter the news, for the purpose of getting the ones related to traffic  
        const filteredNews = FromGoogleSerpApi.filter((item) =>  
          filterParams.keywords.some((keyword) =>  
            item.title.toLowerCase().includes(keyword.toLowerCase())  
          ) &&  
          item.title.toLowerCase().includes(filterParams.location.toLowerCase())  
        );  
  
        // for Sorting the filtered news by date  
        const sortedNews = filteredNews.sort((a, b) => {
          const parseDate = (dateString) => {
            // cleaning the date by Removing the UTC part
            const cleanedDate = dateString.replace(/,\s*\+\d{4}\s+UTC/, '');
            // Split the string into date and time (separete them)
            const [datePart, timePart] = cleanedDate.split(', ');
        
            // Further split the date part 
            const [month, day, year] = datePart.split('/').map(Number);
            const [time, modifier] = timePart.split(' ');
        
            // Split the time into hours and minutes
            let [hours, minutes] = time.split(':').map(Number);
            
            // Convert hours to 24-hour format
            if (modifier === 'PM' && hours < 12) {
              hours += 12;
            } else if (modifier === 'AM' && hours === 12) {
              hours = 0;
            }
        
            // Create a new date object for the whole date and time formate
            return new Date(year, month - 1, day, hours, minutes);
          };
        
          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);
        
          return dateB - dateA; // Sort in descending order
        });
         
  
        setNews(sortedNews);  
      } catch (error) {  
        setErrors(error.message || "An unknown error occurred.");
        setModalVisible(true); 

        if (error.message.includes('Rate limit exceeded')) {
          setModalVisible(true); 
        }
      }  
    };  
  
    GettingNews();  
  }, []);


  const closeModal = () => {
    setModalVisible(false);
  };

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

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
  	modalContent: {
		width: "80%",
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
		alignItems: "center",
	},
  	errorText: {
		fontSize: 18,
		color: "red",
		textAlign: "center",
	},
  	closeButton: {
		marginTop: 20,
		padding: 10,
		backgroundColor: "#202A44",
		borderRadius: 5,
	},
  	closeButtonText: {
		color: "white",
		fontSize: 16,
	},
})

export default NewsDisplay;
