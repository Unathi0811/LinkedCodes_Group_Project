import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Button,
  PixelRatio,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Link, router } from "expo-router";
import { useUser } from "../../src/cxt/user";
// // import { useEffect, useRef, useState } from "react";

const videoSource = require("../../assets/video.mp4");

const Home = () => {
  const handleMenuPress = () => {
    console.log("Hamburger menu pressed");
  };

  const { setUser, user } = useUser();

  // const ref = useRef(null);
  // const [isPlaying, setIsPlaying] = useState(true);
  // const player = useVideoPlayer(videoSource, (player) => {
  //   player.loop = true;
  //   player.play();
  // });

  // useEffect(() => {
  //   const subscription = player.addListener("playingChange", (isPlaying) => {
  //     setIsPlaying(isPlaying);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [player]);

  return (
    <View style={styles.container}>
      {/* Fixed header with hamburger button */}
      <View style={styles.headerContainer}>
        <Text style={styles.appName}>InfraSmart</Text>
        <TouchableOpacity
          onPress={handleMenuPress}
          style={styles.hamburgerButton}
        >
          <Icon name="bars" size={24} color="#202A44" />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <ScrollView style={styles.content}>
        {/* infraSmart Video */}
        {/* <View style={styles.contentContainer}>
          <VideoView
            ref={ref}
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => {
                if (isPlaying) {
                  player.pause();
                } else {
                  player.play();
                }
                setIsPlaying(!isPlaying);
              }}
            >
              <Text style={styles.buttonText}>
                {isPlaying ? "Pause" : "Play"}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <Link
          style={styles.manageButton}
          asChild
          href="/(tabs)/Maintainance/reporting"
        >
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage Reports</Text>
            <Icon name="file-text" size={24} color="#FFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </Link>

        {/* Upcoming Maintenance Button */}
        <Link
          style={styles.upcomingButton}
          asChild
          href="/(tabs)/Maintainance/maintain"
        >
          <TouchableOpacity style={styles.upcomingButton}>
            <Text style={styles.upcomingButtonText}>Maintenance</Text>
            <Icon name="wrench" size={24} color="#FFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </Link>

        {/* analytics graphs down here, also they should scroll horizontally, still coming up with an idea*/}
        <Text style={styles.overviewText}>Analytics</Text>
        <Link
          style={styles.upcomingButton}
          asChild
          href="/(tabs)/Maintainance/analytics"
        >
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../../assets/graph1.jpeg")}
              style={styles.image}
            />
            <Text style={styles.headline}>Predictive Analysis</Text>
          </TouchableOpacity>
        </Link>

        <Link
          style={styles.upcomingButton}
          asChild
          href="/(tabs)/Maintainance/analytics"
        >
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../../assets/graph1.jpeg")}
              style={styles.image}
            />
            <Text style={styles.headline}>Maintainance History</Text>
          </TouchableOpacity>
        </Link>

        <Link
          style={styles.upcomingButton}
          asChild
          href="/(tabs)/Maintainance/analytics"
        >
          <TouchableOpacity style={styles.card}>
            <Image
              source={require("../../assets/graph2.jpeg")}
              style={styles.image}
            />
            <Text style={styles.headline}>User Satisfaction</Text>
          </TouchableOpacity>
        </Link>

        {/* Recent Updates Section */}
        <Text style={styles.recentUpdatesTitle}>Recent Updates</Text>
        
        <Link
          style={styles.upcomingButton}
          asChild
          href="/(tabs)/Maintainance/reporting"
        >

        <TouchableOpacity style={styles.card}>
          <Image
            source={require("../../assets/road.png")}
            style={styles.image}
          />
          <Text style={styles.headline}>Pothole Repair Completed</Text>
        </TouchableOpacity>
        </Link>

        <Link
          style={styles.upcomingButton}
          asChild
          href="/(tabs)/Maintainance/maintain"
        >
          
        <TouchableOpacity style={styles.card}>
          <Image
            source={require("../../assets/bridge.png")}
            style={styles.image}
          />
          <Text style={styles.headline}>Bridge Inspection Scheduled</Text>
        </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Updates</Text>
        </TouchableOpacity>

        <View style={styles.educationalSection}>
          <Text style={styles.educationalText}>
            Learn about the latest maintenance practices and reporting tools.
          </Text>
         
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
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
    flexDirection: "column"
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
  video: {
    width: 310,
    height: 200,
    borderRadius: 30,
    shadowColor: "#202A44",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    marginBottom: -20,
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
  }
  
});