import { View, Text, Image, FlatList, ActivityIndicator, Linking, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import CurrentDay from "../../components/weather-API/CurrentDay";
import { News } from '../../components/News-API/News';
import { Link, router } from "expo-router";
import { useUser } from "../../../src/cxt/user";
import "react-native-gesture-handler";
import { Drawer } from "react-native-drawer-layout";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";

const Home = () => {
  const [news, setNews] = useState([]);
  const [error, setErrors] = useState(null);
  const [open, setOpen] = React.useState(false);
  
  const { setUser, user } = useUser();

  const handleMenuPress = () => {
    setOpen(!open);
  };

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
    <SafeAreaView style={{padding:1, backgroundColor:'#EAF1FF'}}>
 
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

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        // console.log("Drawer Content working!");
        return (
        <View style={styles.drawer}>
          <View style={styles.drawerContent}>
            <Text style={styles.drawerHeader}>Menu</Text>
            {/* I want four links here one for notifications, account, settings, device permissins, logout button, */}
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(userTabs)/home/notifications")}
            >
              <Text  style={styles.drawerItemText}>Notification</Text>
              <Icon name="bell" size={20} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(userTabs)/home/profile")}
            >
              <Text style={styles.drawerItemText}>Profile</Text>
              <Icon name="user" size={22} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(userTabs)/home/settings")}
            >
              <Text style={styles.drawerItemText}>Settings</Text>
              <Icon name="cog" size={20} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(userTabs)/home/rate")}
            >
              <Text style={styles.drawerItemText}>RateUs</Text>
              <Icon2 name="fingerprint" size={20} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(userTabs)/home/emergency")}
            >
              <Text style={styles.drawerItemText}>Emergency</Text>
              <Icon2 name="fingerprint" size={20} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                Alert.alert(
                  "Logout",
                  "Are you sure you want to logout?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Logout canceled"),
                      style: "cancel",
                    },
                    {
                      text: "Logout",
                      onPress: () => signOut(auth),
                      style: "destructive",
                    },
                  ],
                  { cancelable: true }
                );
              }}
            >
              <Text style={styles.drawerItemText}>Logout</Text>
              <Icon name="sign-out" size={20} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>
          </View>
        </View>
        )
      }}
    >
    <View style={styles.container}>
      {/* Fixed header with hamburger button */}
      <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={handleMenuPress}
            style={styles.hamburgerButton}
          >
            <Icon name="bars" size={24} color="#202A44" />
          </TouchableOpacity>
          <Text style={styles.appName}>InfraSmart</Text>
        </View>
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
    </Drawer>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#F2f9FB",
  },
  hamburgerButton: {
    padding: 10,
    marginTop: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginTop: 20,
  },
  drawer: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  drawerContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "flex-start",
    flex: 1,
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#202A44",
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "100%",
    backgroundColor: "#202A44",
    marginBottom: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    flexDirection: "row",         
    justifyContent: "space-between", 
    alignItems: "center",     
  },
  drawerItemText: {
    fontSize: 15,
    color: "#fff",
  },
  drawerIcon: {
    marginLeft: 23,
  }
})