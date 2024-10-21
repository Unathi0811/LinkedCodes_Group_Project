import { View, Text, Image, FlatList, ActivityIndicator, Linking, TouchableOpacity } from 'react-native';
import { View, Text, Image, FlatList, ActivityIndicator, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import CurrentDay from "../components/weather-API/CurrentDay";
import { News } from '../components/News-API/News';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import { router } from 'expo-router';

// have your drawer code here!
const Home = ({ navigation }) => { // Accept navigation as a prop

  const [news, setNews] = useState([]);
  const [error, setErrors] = useState(null);

  useEffect(() => {

    const GettingNews = async () => {
      try {
        const FromNews24 = await News();

        const filteredNews = FromNews24.filter(item =>
          item.title.toLowerCase().includes('traffic') ||
          item.title.toLowerCase().includes('road') ||
          item.title.toLowerCase().includes('accident') ||
          item.title.toLowerCase().includes('roadblock') ||
          (item.description && item.description.toLowerCase().includes('traffic')) ||
          (item.description && item.description.toLowerCase().includes('roadblock')) ||
          (item.description && item.description.toLowerCase().includes('accident')) ||
          (item.description && item.description.toLowerCase().includes('road')) 
        );
        setNews(filteredNews);

      } catch (error) {
        setErrors(error.message);
      }
    };

    GettingNews();
  }, []);

  if (error){
    return(<Text> </Text>)
  }

  const renderItem = ({ item }) => (
    <SafeAreaView style={{padding:1, backgroundColor:'#EAF1FF', }}>
 
        <View style={{padding:10,borderBottomWidth: 1,borderBottomColor:'black',backgroundColor:'#fff',
          borderRadius:5, marginVertical:-8, }}>

          <Text style={{fontSize: 22,fontWeight: 'bold', marginBottom:10 }}>
            {item.title}
          </Text>
          {item.urlToImage && <Image source={{ uri: item.urlToImage }}
                  style={{width:'100%', height:200, marginBottom:10,borderRadius:5}} />}

          <Text style={{fontSize: 16,color: 'black',fontStyle: 'italic', fontWeight:'bold'}}>
            By {item.author || 'Unknown'}
          </Text>
          <Text style={{fontSize: 16,marginVertical: 10,}}>
            {item.description}
          </Text>
          <Text style={{fontSize: 12,color: 'black', fontStyle:'italic',marginBottom:5  }}>
            Published on: {new Date(item.publishedAt).toLocaleDateString()}
            {/* Published on: {item.publishedAt} */}
            </Text>
          <Text style={{ fontSize: 14, color: 'blue', marginBottom:5 }} 
                onPress={() => Linking.openURL(item.url)}>
              Click to read more....
          </Text>
       </View>
    </SafeAreaView>
  );

  const handleHamburger = () =>{
    console.log("hamburger pressed")
    // this where to hamburger to make a move
    router.push("../hamburger/")
  }

  return (
    <View style={{marginHorizontal:4,padding:2}}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity onPress={handleHamburger} style={{ marginTop: 10, marginLeft: 10 }}>
        <Icon name="bars" size={30} color="#000" />
      </TouchableOpacity>

      <View style={{}}>
        <CurrentDay/>
      </View>
      <View style={{height:'83%'}}>
        <FlatList
            data={news}
            renderItem={renderItem}
            keyExtractor={item => item.url}
          />
      </View>
    </View>
  );
};

export default Home;
