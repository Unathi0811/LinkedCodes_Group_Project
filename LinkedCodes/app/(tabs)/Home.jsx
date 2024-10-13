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
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";

const videoSource =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const Home = () => {
  const handleMenuPress = () => {
    console.log("Hamburger menu pressed");
  };

  const { setUser, user } = useUser();

  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

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
        {/* <Text style={styles.username}>Hi {user.username ?? "Unknown Name"}!</Text> */}

        <Link
          style={styles.manageButton}
          asChild
          href="/(tabs)/Maintainance/reporting"
        >
          <TouchableOpacity style={styles.manageButton}>
            <Text style={styles.manageButtonText}>Manage Reports</Text>
          </TouchableOpacity>
        </Link>

        {/* Upcoming Maintenance Button */}
        <Link
          style={styles.upcomingButton}
          asChild
          href="/(tabs)/Maintainance/maintain"
        >
          <TouchableOpacity style={styles.upcomingButton}>
            <Text style={styles.upcomingButtonText}>Upcoming Maintenance</Text>
          </TouchableOpacity>
        </Link>

        {/* analytics graphs down here, also they should scroll horizontally, still coming up with an idea*/}
        <Text style={styles.overviewText}>Analytics</Text>
        <View style={styles.card}>
          <Image
            source={require("../../assets/graph1.jpeg")}
            style={styles.image}
          />
          <Text style={styles.headline}>Predictive Analysis</Text>
        </View>
        <View style={styles.card}>
          <Image
            source={require("../../assets/graph1.jpeg")}
            style={styles.image}
          />
          <Text style={styles.headline}>Maintainance History</Text>
        </View>

        <View style={styles.card}>
          <Image
            source={require("../../assets/graph2.jpeg")}
            style={styles.image}
          />
          <Text style={styles.headline}>User Satisfaction</Text>
        </View>

        {/* Recent Updates Section */}
        <Text style={styles.recentUpdatesTitle}>Recent Updates</Text>
        <View style={styles.card}>
          <Image
            source={require("../../assets/road.png")}
            style={styles.image}
          />
          <Text style={styles.headline}>Pothole Repair Completed</Text>
        </View>
        <View style={styles.card}>
          <Image
            source={require("../../assets/bridge.png")}
            style={styles.image}
          />
          <Text style={styles.headline}>Bridge Inspection Scheduled</Text>
        </View>

        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Updates</Text>
        </TouchableOpacity>

        <View style={styles.educationalSection}>
          <Text style={styles.educationalText}>
            Learn about the latest maintenance practices and reporting tools.
          </Text>
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
              <Button
                title={isPlaying ? "Pause" : "Play"}
                onPress={() => {
                  if (isPlaying) {
                    player.pause();
                  } else {
                    player.play();
                  }
                  setIsPlaying(!isPlaying);
                }}
              />
            </View>
          </View> */}
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
    alignItems: "center",
    marginBottom: 10,
  },
  manageButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  upcomingButton: {
    backgroundColor: "#202A44",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  upcomingButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
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
    alignItems: "center",
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
    textAlign: "center",
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
  educationalSection: {
    backgroundColor: "#E8F4F8",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  educationalText: {
    fontSize: 16,
    color: "#202A44",
    flex: 1,
  },
  educationalIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
    width: "100%",
    height: 275,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#202A44",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
