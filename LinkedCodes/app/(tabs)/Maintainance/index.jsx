import { StyleSheet, Text, TouchableOpacity, View, Pressable, ScrollView, Image, Alert } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link } from "expo-router";
import { useRouter } from 'expo-router';
import "react-native-gesture-handler";
import { Drawer } from "react-native-drawer-layout";
import { signOut } from "firebase/auth";
import Icon2 from "react-native-vector-icons/MaterialIcons";

const Maintenance = () => {
  const [open, setOpen] = React.useState(false);

  const handleMenuPress = () => {
    setOpen(!open);
  };

  const router = useRouter();

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
              onPress={() => router.push("/(tabs)/Settings/notifications")}
            >
              <Text  style={styles.drawerItemText}>Notification</Text>
              <Icon name="bell" size={20} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(tabs)/Profile")}
            >
              <Text style={styles.drawerItemText}>Profile</Text>
              <Icon name="user" size={22} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(tabs)/Settings")}
            >
              <Text style={styles.drawerItemText}>Settings</Text>
              <Icon name="cog" size={20} color="#fff" style={styles.drawerIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push("/(tabs)/Settings/permissions")}
            >
              <Text style={styles.drawerItemText}>Permissions</Text>
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.hamburgerButton}>
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity>
        <Text style={styles.appName}>InfraSmart</Text>
      </View>
      <ScrollView  style={styles.contentContainer}>
        {/* Buttons for Reporting and Maintenance */ }
        <View style={styles.linkContainer} >
            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/(tabs)/Maintainance/reporting")} >
              <Text style={styles.linkText}>REPORTING</Text>
              <Icon name="chevron-right" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/(tabs)/Maintainance/maintain")}>
              <Text style={styles.linkText}>MAINTAIN</Text>
              <Icon name="chevron-right" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/(tabs)/Maintainance/analytics")}>
              <Text style={styles.linkText}>ANALYTICS</Text>
              <Icon name="chevron-right" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/(tabs)/Maintainance/statistics")}>
              <Text style={styles.linkText}>STATISTICS</Text>
              <Icon name="chevron-right" size={20} color="#fff" style={styles.icon} />
            </TouchableOpacity>
        </View>
        <View
        style={styles.card}
        >
        <Image 
          source={require("../../../assets/graph1.jpeg")}
          style={styles.image}
        />
        </View>
      </ScrollView>
    </View>
    </Drawer>
  );
};

export default Maintenance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  headerContainer: {
    position: "absolute",
    top: 6,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#F2f9FB",
},
appName: {
  fontSize: 24,
  fontWeight: "bold",
  color: "#202A44",
},
  hamburgerButton: {
    padding: 10,
  },
  contentContainer: {
    marginTop: 90,
    paddingHorizontal: 20,
  },
  linkContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  linkButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#202A44",
    height: 53,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 123,
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
    height: 280 ,
    flexDirection: "column"
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
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