import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  orderBy,
  where,
  doc,
  getDoc,
  query,
  Timestamp,
} from "firebase/firestore";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/Feather";
import Icon4 from "react-native-vector-icons/FontAwesome";
import { GiftedChat } from "react-native-gifted-chat";
import { Overlay } from "@rneui/themed";
import Geocoder from "react-native-geocoding"; // Import geocoding library
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome5";
import { updateDoc } from "firebase/firestore";

// Initialize the Geocoding API with your API key
Geocoder.init("AIzaSyAQ6VsdSIFTQYmic060gIGuGQQd2TW4jsw");
import { useUser } from "../../../src/cxt/user";

function Reporting() {
  const { user } = useUser();
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationDescription, setLocationDescription] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Submitted");
  const [imageLoadingMap, setImageLoadingMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoadingReports(true);
        const reportsCollection = collection(db, "reports");
        const reportSnapshot = await getDocs(reportsCollection);
        const reportList = await Promise.all(
          reportSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const locationDescription =
              data.latitude && data.longitude
                ? await fetchLocationDescription(data.latitude, data.longitude)
                : "Location not available"; // Fetch location description for each report

            return {
              id: doc.id,
              ...data,
              locationDescription, // Attach the location description
            };
          })
        );

        console.log("Fetched Reports:", reportList);

        const filteredReports = reportList.filter(
          (report) => report.userId !== undefined
        );
        const userIds = [
          ...new Set(filteredReports.map((report) => report.userId)),
        ];

        const userPromises = userIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "user", userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            return {
              userId,
              name: userData.username,
              profilePhoto:
                userData.profileImage || "https://via.placeholder.com/60", // Default image if not set
            };
          }
          return {
            userId,
            name: "Unknown User",
            profilePhoto: "https://via.placeholder.com/60",
          }; // Placeholder image for missing users
        });

        const userData = await Promise.all(userPromises);
        const userMap = {};
        userData.forEach((user) => {
          userMap[user.userId] = user; // Store user data (name and profilePhoto)
        });

        setUserNames(userMap);
        setReports(filteredReports);
      } catch (error) {
        console.error("Error fetching reports: ", error);
        setError("Could not load reports. Please try again later.");
        setOverlayVisible(true);
      } finally {
        setLoadingReports(false);
      }
    };

    fetchReports();
  }, [user]);

  // const filteredReports = reports.filter((report) => report.status === filter);

  const fetchLocationDescription = async (lat, long) => {
    try {
      const res = await Geocoder.from(lat, long);
      const address = res.results[0].formatted_address; // Assuming results[0] has the address
      return address;
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Unable to fetch location.";
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter === selectedFilter ? null : filter); // Toggle filter
  };

  const filteredReports =
    selectedFilter === "Submitted"
      ? reports
      : selectedFilter
      ? reports.filter((report) => report.status === selectedFilter)
      : [];

  //updating the report status
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const reportRef = doc(db, "reports", reportId); // Reference to the specific report
	  const reportSnapshot = await getDoc(reportRef)

	  if(reportSnapshot.exists()){
		const reportData = reportSnapshot.data()
		const userId = reportData.userId

		await updateDoc(reportRef, {
		  status: newStatus, // Update the status field
		});

		console.log(`Report ${reportId} updated to ${newStatus}`);

		//create a notification for the user who submitted the report
		await addDoc(collection(db, "notifications"), {
			userId: userId,
			reportId: reportId,
			status: newStatus,
			timestamp: new Date()
		})
	
		// Optionally, you can update the local state or show a success message
		setReports((prevReports) =>
		  prevReports.map((report) =>
			report.id === reportId ? { ...report, status: newStatus } : report
		  )
		);
	  }
    } catch (error) {
      console.error("Error updating report status: ", error);
      setError("Could not update report status. Please try again later.");
      setOverlayVisible(true);
    }
  };

  // Fetch chat messages for the selected report
  const fetchChatMessages = (reportCreatorId) => {
    const currentUserId = auth.currentUser.uid;
    const chatId = [reportCreatorId, currentUserId].sort().join("_");

    const collectionRef = collection(db, "chats");
    const q = query(
      collectionRef,
      where("chatId", "==", chatId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLoadingChat(true);
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
      setLoadingChat(false);
    });

    return () => unsubscribe();
  };

  const statusIcons = {
    Submitted: "file-text-o",
    "In-Progress": "spinner",
    Completed: "check-circle",
  };

  // For the location
  const showLocation = async (lat, long) => {
    setLatitude(lat);
    setLongitude(long);

    try {
      const res = await Geocoder.from(lat, long); // Get location description from latitude and longitude
      const address = res.results[0].formatted_address; // Assuming results[0] has the address
      setLocationDescription(address);
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocationDescription("Unable to fetch location.");
    }
    setLocationModalVisible(true);
  };

  const onSend = useCallback(
    (messages = []) => {
      const currentUserId = auth.currentUser.uid;
      const reportCreatorId = selectedReport.userId;
      const chatId = [reportCreatorId, currentUserId].sort().join("_");

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );

      const { _id, createdAt, text, user } = messages[0];
      addDoc(collection(db, "chats"), {
        _id,
        createdAt,
        text,
        user,
        chatId,
      });
    },
    [selectedReport]
  );

  const renderItem = ({ item }) => {
    const user = userNames[item.userId] || {
      name: "Unknown User",
      profilePhoto: "https://via.placeholder.com/60",
    }; // Default values for unknown users

    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.reportContainer}>
          {/* Image with loading indicator */}
          {imageLoadingMap[item.id] && (
            <ActivityIndicator
              size="small"
              color="#202A44"
              style={styles.loadingIndicator}
            />
          )}
          <Image
            source={{
              uri: item.image || "https://via.placeholder.com/100",
              cache: "force-cache",
            }}
            style={styles.reportImage}
            onLoadEnd={() =>
              setImageLoadingMap((prev) => ({
                ...prev,
                [item.id]: false,
              }))
            } // Set loading to false when image is loaded
            onError={(e) => {
              console.log("Image load error:", e.nativeEvent.error);
              setImageLoadingMap((prev) => ({
                ...prev,
                [item.id]: false,
              })); // Set loading to false even if there’s an error
            }}
            onLoadStart={() =>
              setImageLoadingMap((prev) => ({
                ...prev,
                [item.id]: true,
              }))
            } // Set loading to true when starting to load
          />
          <View style={styles.detailsContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.description}>User:</Text>
              <Text style={styles.descriptionText}>{user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.description}>Description:</Text>
              <Text style={styles.descriptionText}>
                {item.description || "No description available."}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.description}>Urgency Level:</Text>
              <Text style={styles.descriptionText}>{item.urgency}</Text>
            </View>
            {item.latitude && item.longitude && (
              <View style={styles.infoRow}>
                <Text style={styles.description}>Location:</Text>
                <Text style={styles.descriptionText}>
                  {item.locationDescription || "No location available"}
                </Text>
              </View>
            )}

            <Text style={styles.description}>Status:</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={() => updateReportStatus(item.id, "In-Progress")}
              >
                <Icon4
                  name="spinner"
                  size={24}
                  color={item.status === "In-Progress" ? "#202A44" : "#ccc"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateReportStatus(item.id, "Completed")}
              >
                <Icon4
                  name="check-circle"
                  size={24}
                  color={item.status === "Completed" ? "#202A44" : "#ccc"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedReport(item);
                  setChatVisible(true);
                  fetchChatMessages(item.userId);
                }}
              >
                <Icon2 name="chatbox-outline" size={24} color="#202A44" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const filters = ["Submitted", "In-Progress", "Completed"];

  const renderFilterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => handleFilterChange(item)} // Ensure handleFilterChange exists
    >
      {/* Ensure that statusIcons[item] exists and is valid */}
      {statusIcons[item] && (
        <Icon4 name={statusIcons[item]} size={16} color="#fff" />
      )}

      {/* Text wrapped in <Text> */}
      <Text style={styles.btnText}>{item.toString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignContent: "space-between",
          }}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/Maintainance")}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={20} color="#202A44" />
          </TouchableOpacity>
          <Text style={styles.appName}>InfraSmart</Text>
        </View>
        <FlatList
          data={filters}
          renderItem={renderFilterItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horScrollView}
        />
      </View>

      {/* Reports List */}
      {loadingReports ? (
        <ActivityIndicator size="large" color="#202A44" />
      ) : filteredReports.length > 0 ? (
        <FlatList
          data={filteredReports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : selectedFilter !== "Submitted" ? (
        <Text style={styles.emptyRep}>
          No reports available for this status.
        </Text>
      ) : reports.length > 0 ? (
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.emptyRep}>No reports available.</Text>
      )}

      {/* Error Overlay */}
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
        overlayStyle={styles.overlay}
      >
        <View style={styles.overlayContent}>
          <Icon3
            name="info"
            size={50}
            color="#000"
            style={styles.overlayIcon}
          />
          <Text style={styles.overlayText}>{error}</Text>
        </View>
      </Overlay>

      {/* Confirmation Overlay */}
      <Overlay
        isVisible={confirmationVisible}
        onBackdropPress={() => setConfirmationVisible(false)}
        overlayStyle={styles.overlay}
      >
        <Text>Confirmation Message</Text>
      </Overlay>

      {/* Chat Modal */}
      <Modal
        visible={chatVisible}
        onRequestClose={() => setChatVisible(false)}
        animationType="slide"
      >
        <SafeAreaView style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>
              Chat with{" "}
              {userNames[selectedReport?.userId]?.name || "Unknown User"}
            </Text>
            <TouchableOpacity onPress={() => setChatVisible(false)}>
              <Icon2 name="close" size={24} color="#202A44" />
            </TouchableOpacity>
          </View>
          <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
              _id: auth.currentUser.uid, // Current user's ID
            }}
            renderLoading={() => (
              <ActivityIndicator size="large" color="#202A44" />
            )}
          />
          {loadingChat && <ActivityIndicator size="large" color="#202A44" />}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

export default Reporting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2f9FB",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#fff",
    elevation: 5,
    marginBottom: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginTop: 20,
    marginLeft: 200,
  },
  list: {
    marginTop: 160,
    padding: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    width: "95%",
    marginBottom: 15,
    marginLeft: 10,
    shadowColor: "#202A44",
    shadowOffset: { width: 4, height: 44 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    elevation: 3,
    overflow: "hidden",
    alignItems: "center",
  },
  profileContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#202A44",
  },
  initials: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202A44",
    textAlign: "center",
    marginTop: 5,
  },
  reportContainer: {
    flex: 1,
  },
  reportImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    resizeMode: "cover",
    alignSelf: "center",
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btn: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 184,
    height: 50,
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#202A44",
    marginLeft: 13,
  },
  btnText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  overlayText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#202A44",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  closeChatButton: {
    padding: 15,
    backgroundColor: "#202A44",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  emptyRep: {
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
    marginBottom: "70%",
    color: "#202A44",
  },
  overlay: {
    width: "80%",
    height: 320,
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayContent: {
    alignItems: "center",
  },
  overlayIcon: {
    marginBottom: 15,
  },
  overlayText: {
    fontSize: 16,
    textAlign: "center",
  },
  locationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  locationText: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
  },
  closeLocationButton: {
    backgroundColor: "#202A44",
    padding: 10,
    borderRadius: 5,
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginBottom: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    color: "#202A44",
    fontWeight: "bold",
    marginBottom: 4,
    marginVertical: 4,
  },
  descriptionText: {
    color: "#ccc",
    marginBottom: 4,
    marginVertical: 4,
    marginRight: 23,
  },
  infoRow: {
    flexDirection: "row",
  },
});
