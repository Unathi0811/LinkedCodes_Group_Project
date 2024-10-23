import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Link, router,useRouter } from 'expo-router';

const API_KEY = '4f2f439b78ba6d3fc2a94a59bd39287a';

const CurrentDay = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter()

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

    // asking for permission to access the location on the devide 
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Unable to get permissions from device to use location.');
          setLoading(false);
          return;
        }
        // getting access to the current location of the user
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
  // to have access to the current weather of which is a todays weather
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

  const handleButton = () =>{
    router.push('/components/weather-API/Forecast')
  }


  return (
    <ScrollView >

      {weather && todayWeather && (
        <View style={{flexDirection: 'row',paddingHorizontal: 6, borderRadius: 8, backgroundColor:'#EAF1FF',paddingVertical:'1%',marginBottom:'2%',marginTop:'30%'}}>
    
        <View style={{ backgroundColor:'#202A44',borderRadius: 12,width:'38%',padding: 8,justifyContent:'center',marginRight:'3%' }}>

        <Text style={{fontSize: 16, fontWeight: 'bold',color: '#EAF1FF',alignItems:'center',marginBottom:'9%'}}>
            {weather.city.name}, {weather.city.country}
          </Text>

          <View style={{flexDirection: 'row',alignItems:'center',marginBottom:'9%',marginRight:'30%' }}>
              <Image
                source={{ uri: `http://openweathermap.org/img/wn/${todayWeather.weather[0].icon}.png` }}
                style={{width: '60%', height: '100%',}}
              />
              <Text style={{fontSize: 25,color: '#EAF1FF'}}>{todayWeather.main.temp}</Text><Text style={{ fontSize:15, color: '#EAF1FF',  }}>°C</Text>
          </View>

              <Text style={{ fontSize: 15, color: '#EAF1FF',marginBottom:'5%' }}>{todayWeather.weather[0].description}</Text>
        </View>

        <View style={{width:'58%', backgroundColor:'#EAF1FF',padding: 8,borderRadius: 12,borderRightWidth:1, borderRightColor:'#202A44'}}>

              <View style={{flexDirection: 'row',alignItems:'center',marginBottom:'5%' }}>
                    
                  <Text style={{marginRight:'20%',fontSize: 16, fontWeight: 'bold'}}>
                    {new Date(todayWeather.dt * 1000).toLocaleDateString('en-US',{weekday:'long'})}, {new Date(todayWeather.dt * 1000).toLocaleDateString()}
                  </Text>
                  
                  <TouchableOpacity  onPress={handleButton}> 
                    <Text>
                      <MaterialIcons name="east" size={20}color={'#202A44'} />
                    </Text>
                  </TouchableOpacity> 
              </View>

              <View style={{flexDirection: 'row',alignItems:'center',marginRight:'5%', }}>

                  <View style={{marginRight:'15%',borderLeftWidth:1,borderLeftColor:'#202A44' }} >
                    <Text > <FontAwesome name="tachometer" size={12} />  {todayWeather.main.pressure} hPa</Text>
                    <Text > <FontAwesome name="tint" size={12} />   {todayWeather.main.humidity}%</Text>
                    <Text > <MaterialIcons name="air" size={12} />  {todayWeather.wind.speed} m/s</Text>
                  </View>
                  <View style={{borderLeftWidth:1,borderLeftColor:'#202A44' }}>
                    <Text >  <MaterialIcons name="navigation" size={12} />  {todayWeather.wind.deg}°</Text>
                    <Text >  <MaterialIcons name="cloud" size={12} />  {todayWeather.clouds.all}%</Text>
                    <Text >  <MaterialIcons name="water" size={12} />  {todayWeather.rain ? todayWeather.rain['1h'] : '0'} mm</Text>
                  </View>
              </View>
        </View>
      </View>
      )}
    </ScrollView>
  );
};

export default CurrentDay;