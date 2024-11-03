import React, { useEffect, useRef, useState } from 'react';
import { View, 
         Text, 
         ActivityIndicator,
         TextInput,
         TouchableOpacity, 
         Linking, StyleSheet, 
         FlatList, 
         Modal,
         KeyboardAvoidingView,
         Platform
        } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { auth } from '../../firebase';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';


const GOOGLE_API_KEY = 'AIzaSyAQ6VsdSIFTQYmic060gIGuGQQd2TW4jsw';  // Google API Key
const TOMTOM_API_KEY = 'EErTrgCfI6nmg4kR8fboWoe2LJdDDs4E';  // TomTom API Key

const traffic = () => {
  const mapRef = useRef(null)
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState([]);
  const [trafficData, setTrafficData] = useState(null);
  const [trafficIncidents, setTrafficIncidents] = useState([]);
  const [warningMsg, setWarningMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null); // For destination marker
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showTrafficModal, setShowTrafficModal] = useState(false); 
  const [incidentModalVisible, setIncidentModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showAd, setShowAd] = useState(false); // Ad visibility
  const [isSubscribed, setIsSubscribed] = useState(false); // Subscription status
  const inactivityTimeoutRef = useRef(null)
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const router = useRouter()


  // ask for permission to use the location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setWarningMsg('Permission denied');
        return;
      }
      // get access to the current location 
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setMapRegion({ 
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const locationSubscription = Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 }, // Adjust as needed
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );

      return () => {
        locationSubscription.then(sub => sub.remove());
      };
    })();
  }, []);
// to center the map to the current location of the user 
const centerMapOnCurrentLocation = () => {
  if (location) {
    setMapRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }
};

  // code for keep on updating the traffic every minutes 
  useEffect(() => {
    const interval = setInterval(async () => {
      if (directions.length > 0) {
        const trafficResponse = await fetchTrafficData(directions);
        if (trafficResponse) {
          setTrafficData(trafficResponse);
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [directions]);


 const fetchDirections = async () => {
    if (!location || !destination) return;

    const origin = `${location.latitude},${location.longitude}`;
    try {
      setLoading(true);
      const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
        params: {
          origin,
          destination,
          key: GOOGLE_API_KEY,
        },
      });

      const route = response.data.routes[0];
      if (!route) {
        setWarningMsg('No route found');
        return;
      }

      const points = decodePolyline(route.legs[0].steps);
      setDirections(points);

      // Set destination coordinates for marker
      const destinationLocation = await getDestinationCoordinates(destination);
      if (destinationLocation) {
        setDestinationCoordinates(destinationLocation);
      }

      // Fetch initial traffic data
      const trafficResponse = await fetchTrafficData(points);
      if (trafficResponse) {
        setTrafficData(trafficResponse);
      }

      // Fetch traffic incidents
      const incidentsResponse = await fetchTrafficIncidents(points);
      if (incidentsResponse) {
        setTrafficIncidents(incidentsResponse);
      }

    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to fetch directions, Please Try again later');
    } finally {
      setLoading(false);
    }
  };


// for displaying the ads
  useEffect(() => {
    const checkSubscription = async () => {
      const subscriptionStatus = await AsyncStorage.getItem(`isSubscribed_${userId}`);
      if (subscriptionStatus === 'true') {
        setIsSubscribed(true);
        setShowAd(false); // Disable ads if subscribed
      } else {
        setShowAd(true);
      }
    };
    if (userId) checkSubscription();
  }, [userId]);

    const handleActivity = () => {
    clearTimeout(inactivityTimeoutRef.current);
    if (!isSubscribed) {
      inactivityTimeoutRef.current = setTimeout(() => setShowAd(true), 5000); // Show ad only if not subscribed
    }
  };

 
  // get the destination the user has searched 
  const getDestinationCoordinates = async (destination) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: destination,
          key: GOOGLE_API_KEY,
        },
      });
      const location = response.data.results[0]?.geometry.location;
      return location ? { latitude: location.lat, longitude: location.lng } : null;
    } catch (error) {
      setErrorMsg('Error fetching destination coordinates:', error);
      return null;
    }
  };
 
  // fetching traffic data from the tom tom end point  using coordinate 
  const fetchTrafficData = async (points) => {
    if (!points || !points.length) 
      {
        return null;
      }

    const point = `${points[0].latitude},${points[0].longitude}`; // Use starting point for traffic data
    try {
      const response = await axios.get(
        `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${point}`
      );
      return response.data;
      
    } catch (error) {
      setErrorMsg('Error fetching traffic data:', error.response?.data || error.message)
      return null;
    }
  };

   // for fetching the traffic incident using the coordinates 
   const fetchTrafficIncidents = async (points) => {
    if (!points.length) return [];

    const { latitude: lat1, longitude: lng1 } = points[0];
    const { latitude: lat2, longitude: lng2 } = points[points.length - 1];
    // bounding box takes in 4 coordinate,
    const bbox = `${lng1},${lat1},${lng2},${lat2}`; // Bounding box format: minLng,minLat,maxLng,maxLat
    const url = "https://api.tomtom.com/traffic/services/5/incidentDetails"; // tom tom traffic incident data END POINT
    const params = {
      key: TOMTOM_API_KEY,
      bbox,
      timeValidityFilter: 'present',
      categoryFilter: '6,9,1,14,7'
    };
       
    try {
      const response = await axios.get(url, { params });
      return response.data.incidents || [];
    } catch (error) {

      if (error.response?.status === 400) {
        setErrorMessage('The place is out side the province. We recommand the use of traffic within a province, or continue without updated traffic information ?');
        setIsErrorModalVisible(true);
      }
      return [];
    }
  };

  //for the use of navigation but for now it uses the google navigation to navigate.
  const startNavigation = () => {
    if (!location || !destination) return;

    const origin = `${location.latitude},${location.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    Linking.openURL(url);
  };

  // for displaying the navigation line on the map (blue line) that direct the user 
  const decodePolyline = (steps) => {
    const points = [];
    steps.forEach(step => {
      const path = step.polyline.points;
      points.push(...decode(path));
    });
    return points;
  };

  // a decoding of the polyline to navigate route by the use of polyline (blue line in the map) until it reaches the destination
  const decode = (t) => {
    let coordinates = [];
    let index = 0, lat = 0, lng = 0;

    while (index < t.length) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result >> 1) ^ -(result & 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result >> 1) ^ -(result & 1));
      lng += dlng;

      coordinates.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return coordinates;
  };


  if (!location) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {warningMsg ? <Text>{warningMsg}</Text> : <ActivityIndicator size="large" color="#202A44" />}
      </View>
    );
  };

  //  convert the coordinate to actual address on the google map
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_API_KEY,
        },
      });
      const address = response.data.results[0]?.formatted_address;
      return address || 'Address not found';
    } catch (error) {
      setErrorMsg('Error fetching address:', error)
      return 'Address not found';
    }
  };

  // Fetch suggestions based on user input
  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: GOOGLE_API_KEY,
            location: `${location.latitude},${location.longitude}`,
            radius: 10000, // Radius in meters to focus on nearby places
          },
        }
      );
      setSuggestions(response.data.predictions);
    } catch (error) {
    }
  };

    // Handle suggestion selection
  const handleSuggestionPress = async (placeId) => {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
          },
        }
      );
      const location = response.data.result.geometry.location;
      setDestination(response.data.result.name);
      setDestinationCoordinates({
        latitude: location.lat,
        longitude: location.lng,
      });
      setSuggestions([]); // Clear suggestions after selection
    } catch (error) {
    }
  };


// icons to use for the following incident on the map
const ICON_CATEGORY_MAP = {
    1: 'Accident',
    6: 'Traffic Jam',
    7: 'Lane closed',
    9: 'Road works',
    14: 'Broken Down Vehicle',
  };
  // icons to use for the following incident on the update
const ICON_CATEGORY = {
    1: { name: 'car-crash', color: '#ff0000' }, 
    6: { name: 'car', color: '#ff3300' }, 
    7: { name: 'warning', color: '#ff9900' }, 
    9: { name: 'warning', color: 'orange' }, 
    14: { name: 'warning', color: '#ff6600' }, 
  };

// after extracting the coordinate now it time to get the actual address from them
const IncidentItem = ({ item }) => {
    const [address, setAddress] = useState(null);
  
    useEffect(() => {
      const fetchAddress = async () => {
        const coordinates = item.geometry.coordinates[0]; // Get the first coordinate from the array
        const latitude = coordinates[1]; // Typically, [longitude, latitude]
        const longitude = coordinates[0];
        const fetchedAddress = await getAddressFromCoordinates(latitude, longitude);
        setAddress(fetchedAddress);
      };
  
      fetchAddress();
    }, [item]);
    // display the address after converting the coordinate 
  const categoryName = ICON_CATEGORY_MAP[item.properties.iconCategory] || 'Unknown';
  const categoryIcon = ICON_CATEGORY[item.properties.iconCategory] || { name: 'question', color: '#000' };
  
  let textColor;
  switch (item.properties.iconCategory) {
    case 6: // Traffic Jam
        textColor = 'red';
        break;
    case 9: // Road Works
        textColor = 'orange';
        break;
    case 1: // Accident
        textColor = 'darkred';
        break;
    case 14: // Broken Down Vehicle
        textColor = 'yellow'; 
        break;
    default:
        textColor = '#EAF1FF'; 
        break;
}
    return (
      <View style={{ marginBottom: 10, padding: 5, backgroundColor: '#202A44', borderRadius: 5, borderBottomWidth:1 }}>
        
        <Text style={{ color: '#EAF1FF', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
          Category: {item.properties.iconCategory } 
           {item.iconCategory } 
          {categoryIcon && (
            <FontAwesome name={categoryIcon.name} size={20} color={categoryIcon.color} style={{ marginLeft:25 }} />
          )}
        </Text>
        <Text style={{color:textColor,fontSize:18}}>             {categoryName}</Text>
        <Text style={{color:'#EAF1FF',}}><Ionicons name="location" size={20} color="#EAF1FF" /> {address || 'Fetching address...'}</Text>
      </View>
    );
  };

  // extract only the coordinate of the incident that are close to the searched destination and ignor the rest 
  const extractCoordinates = (coords) => {
    if (!Array.isArray(coords)) return null;
    if (coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      return { latitude: coords[1], longitude: coords[0] }; // Reverse order
    }

    for (const subCoords of coords) {
      const extracted = extractCoordinates(subCoords);
      if (extracted) return extracted;
    }
    return null;
  };

  // only show the incident coordinate that are on the polyline ( compare the current distance with the prev to fine the points that are the nearest)
  const snapToPolyline = (point) => {
    const closestPoint = directions.reduce((prev, curr) => {
      const prevDistance = getDistance(prev, point);
      const currDistance = getDistance(curr, point);
      return prevDistance < currDistance ? prev : curr;
    });
    return closestPoint;
  };

  // function used for calculating the distance
  const getDistance = (coord1, coord2) => {
    const lat1 = coord1.latitude;
    const lon1 = coord1.longitude;
    const lat2 = coord2.latitude;
    const lon2 = coord2.longitude;

    const R = 6371; // Radius of the Earth in km
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  // to display the incident on the map with the use of Icons 
  const TrafficIncidentsList = ({ incidents }) => (
    <>
      {incidents.map((item, index) => {
        const coordinates = extractCoordinates(item.geometry?.coordinates);
        if (!coordinates) return null;
        const snappedCoordinates = snapToPolyline(coordinates);
        const categoryName = ICON_CATEGORY_MAP[item.properties?.iconCategory] || 'Unknown';
        const categoryIcon = ICON_CATEGORY[item.properties.iconCategory] || { name: 'question', color: '#000' };

        return (
          <Marker
            key={index}
            coordinate={snappedCoordinates}
            title={item.properties.description || 'Traffic Incident'}
            description={`Category: ${item.properties.iconCategory},${categoryName}`}
            pinColor="yellow"
          >
             <FontAwesome name={categoryIcon.name} size={15} color={categoryIcon.color} />
          </Marker>
        );
      })}
    </>
  );

  const ErrorModal = ({ visible, message, onClose }) => (
    <Modal visible={visible} transparent>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Error</Text>
          <Text>{message}</Text>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text style={{ color: 'blue' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );


  return (
    <KeyboardAvoidingView  
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  
    style={{  }}  
    >
      <View  style={{height:'100%',}} >
        <MapView
              style={{ width: '100%', height: '100%', borderRadius: 5 }}
              region={mapRegion}
              showsTraffic
              ref={mapRef}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Current Location" />
              {directions.length > 0 && (
                <Polyline
                  coordinates={directions}
                  strokeColor="blue"
                  strokeWidth={5}
                />
              )}
              {destinationCoordinates && (
                <Marker coordinate={destinationCoordinates} title="Destination" />)}
              {trafficIncidents.length > 0 && (
                <TrafficIncidentsList incidents={trafficIncidents} />
              )}

          </MapView>

            {/* <TouchableOpacity
            style={styles.NavigationButton}
              onPress={startNavigation}>
                <Ionicons name="navigate" size={24} color="#fff" />
            </TouchableOpacity> */}

              {/* button for centering the map (back to the current user's location) */}
              <TouchableOpacity  
              style={styles.currentLocationButton}  
              onPress={centerMapOnCurrentLocation}>  
              <Ionicons name="locate" size={24} color="#fff" />
            </TouchableOpacity>

              {/* button to show the traffic data in the map  */}
            <TouchableOpacity
              style={styles.trafficButton}
              onPress={() => {
                setShowTrafficModal(true);
                //use it to fetch the traffic data when the model opens
                fetchTrafficData(); 
              }}
            >
              <MaterialIcons name="speed" size={30} color="red" />
              <Text style={{ color: '#EAF1FF',fontWeight: 'bold',}}>Traffic</Text>
            </TouchableOpacity>

            {/*  touchable for displaing the the traffic incident data */}
            <TouchableOpacity
              style={styles.incidentButton}
              onPress={() => setIncidentModalVisible(true)}
            >
              <MaterialIcons name="traffic" size={30} color="red" />
              <Text style={{ color: '#EAF1FF',fontWeight: 'bold',}}>Update</Text>
            </TouchableOpacity>


              {/*  a search view  */}
          <View style={styles.searchView} > 
              <TextInput
                placeholder="Enter destination"
                value={destination}
                onChangeText={(text) => {
                  setDestination(text);
                  fetchSuggestions(text);
                  }}

                style={{ padding: 5, width: '95%',}}
              />
              <TouchableOpacity style={{ padding: 5, height: 35, position: 'absolute', right: '1%', alignItems: 'center', width: '20%', padding: 5, }}
                onPress={fetchDirections}>
                  <Ionicons name="search" size={24} color="#202A44" />
              </TouchableOpacity>
          </View>

              {/* Suggestions List */}
              {suggestions.length > 0 && (
              <FlatList
                style={styles.suggestionsList}
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSuggestionPress(item.place_id)}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionsText}><Ionicons name="location" size={15} color="#EAF1FF" /> {item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            {/* a modal display for the traffic data  */}
            {showTrafficModal && (
              <View style={styles.floatingModal}>
                  {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                  ) : trafficData ? (
                    <View>
                      <Text style={{ fontSize: 20,color:'#EAF1FF' }}>
                        Traffic  Updates for: {destination}
                      </Text>
                      {trafficData && (
                        <View style={styles.trafficInfo}>
                          <Text style={styles.trafficText}>
                            <Ionicons name="speedometer" size={20} color="blue" />: {trafficData.flowSegmentData.currentSpeed} km/h
                          </Text>
                          <Text style={styles.trafficText}>
                            <Ionicons name="time" size={20} color="white" />: {trafficData.flowSegmentData.currentTravelTime} sec
                          </Text>
                          <Text style={styles.trafficText}>
                            <Ionicons name="speedometer" size={20} color="orange" />: {trafficData.flowSegmentData.freeFlowSpeed} km/h
                          </Text>
                          <Text style={styles.trafficText}>
                            <Ionicons name="remove-circle" size={20} color="red" />: {trafficData.flowSegmentData.roadClosure ? "Yes" : "No"}
                          </Text>
                        </View>
                      )}

                    </View>
                  ) : (
                    <Text style={{fontSize: 20,color:'red'}}>No traffic data available.</Text>
                  )}
                  <TouchableOpacity
                    style={{width:'20%',height:25,backgroundColor:'#EAF1FF',borderRadius: 5,alignItems: 'center',justifyContent: 'center', }}
                    onPress={() => setShowTrafficModal(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
              </View>
            )}

            {/* traffic incident display  */}
            {incidentModalVisible && (
              <View style={styles.floatingIncidentModal}>
                  <View style={{flexDirection:'row', width:'95%',marginBottom: 10,}}> 
                      <Text style={{fontSize:30 ,color:'#EAF1FF',marginLeft: 50}}>Incidents</Text>

                      {/* button to close the view */}
                      <TouchableOpacity
                        style={{position:'absolute', right:0,width:'16%',height:25,backgroundColor:'#EAF1FF',borderRadius: 5,alignItems: 'center',justifyContent: 'center',}}
                        onPress={() => setIncidentModalVisible(false)}
                      >
                        <Text style={styles.buttonText}>Close</Text>
                      </TouchableOpacity>
                  </View>

                  {trafficIncidents.length > 0 ? (
                    <FlatList
                      data={trafficIncidents}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => <IncidentItem item={item} />}
                    />
                  ) : (
                    <Text style={{fontSize: 20,color:'red'}}>No incidents available</Text>
                  )}

              </View>
            )}

          <ErrorModal 
            visible={!!errorMsg} 
            message={errorMsg} 
            onClose={() => setErrorMsg(null)} 
          />

        {/*This is for the add*/}
        <Modal visible={showAd && !isSubscribed} transparent>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
              <Text>wala wala wee wadiweleeeee</Text>
              <Link href="/home/premium" asChild>
              <TouchableOpacity >
                <Text style={{ color: 'black', marginTop: 20 }}>Subscribe to Premuim</Text>
              </TouchableOpacity>
              </Link>
              <TouchableOpacity onPress={() => setShowAd(false)}>
                <Text style={{ color: 'black', marginTop: 20 }}>Close Ad</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* modal display for exceeding the search range */}
        <Modal
              transparent={true} visible={isErrorModalVisible}
              animationType="slide"
              onRequestClose={() => setIsErrorModalVisible(false)}
          >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>

                  <Ionicons name="alert-outline" size={34} color="red" />
                  <Text style={styles.modalTitle}>Destination</Text>

                  <Text style={styles.modalMessage}>{errorMessage}</Text>

                  <TouchableOpacity style={{width:'35%',height:25,backgroundColor:'#EAF1FF',marginLeft:150,borderRadius: 5,alignItems: 'center', }}
                  onPress={() => setIsErrorModalVisible(false)}>
                    <Text style={{color:'#202A44', fontSize:20, }}> Continue </Text>
                  </TouchableOpacity>

                </View>
              </View>
        </Modal>

      </View>
      </KeyboardAvoidingView> 
  );
};

const styles = StyleSheet.create({
  trafficInfo: {
    padding: 10,
    backgroundColor: '#202A44',
    borderRadius: 5,
    flexDirection:'row',
    
  },
  trafficText: {
    marginBottom: 5,
    fontSize:15,
    borderRightWidth:1,
    marginRight:5,
    paddingRight:5,
    borderColor:'#EAF1FF',
    color:'#EAF1FF' 
  },
  currentLocationButton: {  
    position: 'absolute',  
    top: '25%', 
    right: '5%',            
    backgroundColor: '#202A44',  
    height: 50,  
    width: 50,  
    borderRadius: 25,      
    justifyContent: 'center',  
    alignItems: 'center',  
    elevation: 5,          
  },  
  NavigationButton:{
    position: 'absolute',  
    top: '15%',           
    right: '5%',             
    backgroundColor: '#202A44',  
    height: 50,  
    width: 50,  
    borderRadius: 25,     
    justifyContent: 'center',  
    alignItems: 'center',  
    elevation: 5,          
  },
  trafficButton:{
    position: 'absolute',
    bottom: 300,
    left: 15,
    backgroundColor: '#202A44',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  incidentButton:{
    position: 'absolute',
    bottom: 165,
    left: 15,
    backgroundColor: '#202A44',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  trafficUpdate:{
    flexDirection: 'row' ,
    elevation: 10,
    backgroundColor: '#EAF1FF',
    position:'absolute',
    borderRadius:20,
    height:'35%',
    bottom:'0%',
    padding:5,
    justifyContent: 'center',  
    alignItems: 'center',
    right:4, 
  },
  trafficSpeed:{
    flexDirection: 'row' ,
    elevation: 10,
    backgroundColor: '#EAF1FF',
    position:'absolute',
    borderRadius:30,
    bottom:'36%',
    left:5, 
  },
  searchView:{
    flexDirection: 'row' ,
    elevation: 6,
    top: '5%',
    padding:5,
    borderRadius:20,
    height:46,
    position:'absolute',
    backgroundColor: '#EAF1FF',
    paddingHorizontal:10,
    right:9,
    justifyContent: 'center',  
    alignItems: 'center', 
  },
  suggestionsList:{
    position: 'absolute',
    top: 90,
    width: '75%',
    left: 10,
    backgroundColor: '#202A44',
    maxHeight: 140, 
    zIndex: 1000,
    borderRadius:20,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionsText:{
    color:'#EAF1FF'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#202A44',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle:{
    color:'#EAF1FF',
    fontSize: 30,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color:'#EAF1FF'
  },
  floatingModal: {
    position: 'absolute',
    bottom: 255,
    left: 4,
    right: 4,
    backgroundColor: '#202A44',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    maxHeight: '40%', 
  },
  floatingIncidentModal: {
    position: 'absolute',
    bottom: 5,
    left: 4,
    right: 4,
    backgroundColor: '#202A44',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    maxHeight: '30%', 
    padding:10
  },

});

export default traffic;