import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const API_KEY = '4f2f439b78ba6d3fc2a94a59bd39287a';

const CurrentDay = ({ navigation }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (latitude, longitude) => {
      const BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      try {
        const response = await axios.get(BASE_URL);
        setWeather(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Unable to get permissions from device to use location.');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = location.coords;
        fetchWeather(latitude, longitude);
      } catch (error) {
        Alert.alert('Error', 'Unable to get your location');
        setLoading(false);
      }
    };

    getLocation();

  }, []);

  const getTodayWeather = () => {
    const today = new Date().toLocaleDateString();
    const todayWeather = weather.list.filter(item => new Date(item.dt * 1000).toLocaleDateString() === today);
    return todayWeather.length > 0 ? todayWeather[0] : null;
  };

  const todayWeather = weather ? getTodayWeather() : null;

  if (loading) {
    return <ActivityIndicator size="large" color="#202A44" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <ScrollView >

      {weather && todayWeather && (
        <View style={{ padding: 10, borderRadius: 8, backgroundColor: '#202A44',}}>

            <View style={{ alignItems:'center',flex: 1, flexDirection: 'row',}}>

              <View style={{ alignItems:'center',justifyContent:'center',width:'95%' }} >
                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12,color: '#EAF1FF'}}>
                  {weather.city.name},{weather.city.country}
                </Text>
        
              </View>

              <TouchableOpacity //onPress={() => navigation.navigate('')}
                        style={{ }} > 
                <Text>
                  <MaterialIcons name="east" size={20}color={'#EAF1FF'} />
                </Text>
              </TouchableOpacity>
            </View>

          <View>
            {/* <Text style={{fontSize: 16,fontWeight: 'bold',}}>
              {new Date(todayWeather.dt * 1000).toLocaleDateString()} 
            </Text> */}

            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{width:'60%',flex: 1, flexDirection: 'row', justifyContent:'center', borderRightWidth:1, borderRightColor:'#EAF1FF',marginHorizontal:5}}>
                    <Image
                      source={{ uri: `http://openweathermap.org/img/wn/${todayWeather.weather[0].icon}.png` }}
                      style={{width: 60, height: 40,}}
                    />
                    <Text style={{fontSize: 40,color: '#EAF1FF'}}>{todayWeather.main.temp}</Text><Text style={{ fontSize:22, color: '#EAF1FF' }}>°C</Text>
                </View>

                <View style={{width:'40%',alignItems: 'center'}}>
                
                    {/* <Text style={{ fontSize: 14,  }}>Pressure: {todayWeather.main.pressure}hPa</Text>
                    <Text style={{ fontSize: 14,  }}>Humidity: {todayWeather.main.humidity}%</Text> */}
                    <Text style={{ fontSize: 25, color: '#EAF1FF', }}>{todayWeather.weather[0].description}</Text>
                </View>
            </View>

          </View>

        </View>
      )}
    </ScrollView>
  );
};

export default CurrentDay;