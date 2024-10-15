import { View, Text, Image, FlatList, ActivityIndicator, Linking,TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import CurrentDay from "../components/weather-API/CurrentDay";
import { NewsFromGoogleSerpApi } from '../components/News-API/News';
import { useRouter } from 'expo-router';


const Home = () => {
  const router = useRouter()
  const [news, setNews] = useState([]);
  const [error, setErrors] = useState(null);

  useEffect(() => {
    const GettingNews = async () => {
      try {
        const FromGoogleSerpApi = await NewsFromGoogleSerpApi();

        const filteredNews = FromGoogleSerpApi.filter(item =>
          item.title.toLowerCase().includes('traffic') ||
          item.title.toLowerCase().includes('road') ||
          item.title.toLowerCase().includes('roadblock')
        );


        const sortedNews = filteredNews.sort((a, b) => {
          const dateA = new Date(a.date.replace(/, \+0000 UTC/, ' GMT'));
          const dateB = new Date(b.date.replace(/, \+0000 UTC/, ' GMT'));
          return dateB - dateA; 
        });

        setNews(sortedNews);
      } catch (error) {
        setErrors(error.message);
      }
    };

    GettingNews();
  }, []);

  if (error) {
    return (<Text>Error: {error}</Text>);
  }

  const renderItem = ({ item }) => {
    const dateString = item.date; 

    return (
      <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'black', backgroundColor: '#EAF1FF', borderRadius: 5 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
          {item.title}
        </Text>
        {item.thumbnail && (
          <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: 200, marginBottom: 10, borderRadius: 9 }} />
        )}
        <Text style={{ fontSize: 16, color: 'black', fontStyle: 'italic', fontWeight: 'bold' }}>
          By {item.author?.name || 'Unknown'} from {item.source?.name || 'Unknown'}
        </Text>
        <Text style={{ fontSize: 12, color: 'black', fontStyle: 'italic', marginBottom: 5 }}>
          Published on: {dateString}
        </Text>
        <Text style={{ fontSize: 14, color: 'blue', marginBottom: 5 }} onPress={() => Linking.openURL(item.link)}>
          Click to read more....
        </Text>
      </View>
    );
  };

  const handleChat = () => {
      router.push('../components/chatBot/ChatBot')
  }

  return (
    <View style={{ marginBottom: 5, padding: 0, backgroundColor: '#EAF1FF' }}>
      <View style={{ height: '18%' }}>
        <CurrentDay />
      </View>

      <View style={{ height: '83%' }}>
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={item => item.link}
        />
      </View>
      <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#202A44', borderRadius: 250, padding: 10, elevation: 5,width:'20%',height:'10%' }}
               onPress={handleChat}
               >
        <Text style={{ fontSize: 40, color: 'white' }}>  </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
