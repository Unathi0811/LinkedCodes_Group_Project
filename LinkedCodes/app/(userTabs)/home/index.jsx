import { signOut } from "firebase/auth";
import {auth} from "../../../firebase"
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import * as React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import { useUser } from "../../../src/cxt/user";
import "react-native-gesture-handler";
import { Drawer } from "react-native-drawer-layout";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CurrentDay from "../../../src/components/weather-API/CurrentDay";
import NewsDisplay from "../../../src/components/News-API/NewsDisplay";

const Home = () => {
  const [open, setOpen] = React.useState(false);

  const handleMenuPress = () => {
    setOpen(!open);
  };

  const { setUser, user } = useUser();

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
                <Text style={styles.drawerItemText}>Notification</Text>
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
                <Text style={styles.drawerItemText}>Rate Us</Text>
                <Icon2 name="star" size={24} color="#fff" style={styles.drawerIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => router.push("/(userTabs)/home/premium")}
              >
                <Text style={styles.drawerItemText}>Premium</Text>
                <MaterialIcons name="workspace-premium" size={24} color="#fff" />
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
        {/* weather display  */}
        <View> 
          <CurrentDay/>
        </View>
        <Text style={styles.NewsTitle}>News</Text>
        {/* news display  */}
        <View>
          <NewsDisplay/>
         </View>
      </View>
      
    </Drawer>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF1FF",
  },
  username: {
    fontSize: 20,
    color: "#202A44",
    fontWeight: "bold",
    marginBottom: 34,
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
  NewsTitle:{
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginTop: 10,
    marginBottom: 5,
    marginLeft:12,
    backgroundColor:'#EAF1FF'
  },
  content: {
    marginTop: 130,
    paddingHorizontal: 20,
  },
  overviewText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#202A44",
  },
  manageButton: {
    backgroundColor: "#202A44",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "flex-start",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  manageButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  upcomingButton: {
    backgroundColor: "#202A44",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  upcomingButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  recentUpdatesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#202A44",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#202A44",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
    padding: 15,
    marginVertical: 10,
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  headline: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    color: "#202A44",
  },
  viewAllButton: {
    alignItems: "center",
    marginVertical: 10,
  },
  viewAllText: {
    color: "#202A44",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
    width: "100%",
    height: 275,
    backgroundColor: "#202A44",
    borderRadius: 15,
    shadowColor: "#202A44",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    alignItems: "center",
    marginBottom: 34,
  },
  controlsContainer: {
    padding: 10,
  },
  customButton: {
    backgroundColor: "#202A44",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 15,
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
});
