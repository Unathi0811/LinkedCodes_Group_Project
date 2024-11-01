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

} from "firebase/firestore";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/Feather";
import Icon4 from "react-native-vector-icons/FontAwesome";
import { GiftedChat } from "react-native-gifted-chat";
import { Overlay } from "@rneui/themed";
import Geocoder from "react-native-geocoding"; // Import geocoding library

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
                : "Location not available";

            return {
              id: doc.id,
              ...data,
              locationDescription,
            };
          })
        );

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
              profilePhoto: userData.profileImage || "https://via.placeholder.com/60",
            };
          }
          return {
            userId,
            name: "Unknown User",
            profilePhoto: "https://via.placeholder.com/60",
          };
        });

        const userData = await Promise.all(userPromises);
        const userMap = {};
        userData.forEach((user) => {
          userMap[user.userId] = user;
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

  const fetchLocationDescription = async (lat, long) => {
    try {
      const res = await Geocoder.from(lat, long);
      return res.results[0]?.formatted_address || "Unable to fetch location."; // Use optional chaining
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Unable to fetch location.";
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter === selectedFilter ? null : filter);
  };

  const filteredReports =
    selectedFilter === "Submitted"
      ? reports
      : selectedFilter
      ? reports.filter((report) => report.status === selectedFilter)
      : [];
const updateReportStatus = async (reportId, newStatus) => {
  try {
    const reportRef = doc(db, "reports", reportId);
    const reportSnapshot = await getDoc(reportRef);

    if (reportSnapshot.exists()) {
      const reportData = reportSnapshot.data();
      const userId = reportData.userId; // Get the userId from the report

      // Update the report status
      await updateDoc(reportRef, { status: newStatus });

      // Create a notification for the user who submitted the report
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        reportId: reportId,
        status: newStatus,
        timestamp: new Date(),
      });

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
    };

    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: user.profilePhoto }}
            style={styles.profileImage}
          />
          <Text style={styles.initials}>{user.name}</Text>
        </View>
        <View style={styles.reportContainer}>
          <Image
            source={{ uri: item.image || "https://via.placeholder.com/100" }}
            style={styles.reportImage}
            onError={(e) =>
              console.log("Image load error:", e.nativeEvent.error)
            }
          />
          <Text style={styles.description}>
            Description: {item.description || "No description available."}
          </Text>
          <Text style={styles.description}>
            Urgency Level: {item.urgency}
          </Text>
          {item.latitude && item.longitude && (
            <Text style={styles.description}>
              Location: {item.locationDescription || "No location available"}
            </Text>
          )}
          <Text style={styles.description}>Status:</Text>
          <View style={styles.statusIcons}>
            <TouchableOpacity
              onPress={() => updateReportStatus(item.id, "In-Progress")}
            >
              <Icon4
                name="spinner"
                size={20}
                color={item.status === "In-Progress" ? "blue" : "gray"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateReportStatus(item.id, "Resolved")}
            >
              <Icon4
                name="check"
                size={20}
                color={item.status === "Resolved" ? "green" : "gray"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => updateReportStatus(item.id, "Unresolved")}
            >
              <Icon4
                name="times"
                size={20}
                color={item.status === "Unresolved" ? "red" : "gray"}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => {
              setChatVisible(true);
              setSelectedReport(item);
              fetchChatMessages(item.userId);
            }}
          >
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loadingReports ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredReports.length > 0 ? filteredReports : reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.id || item.index}
          style={styles.list}
        />
      )}
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        <Text>{error}</Text>
      </Overlay>
      <Modal visible={chatVisible} animationType="slide">
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: auth.currentUser.uid,
          }}
          renderLoading={() => (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        />
        <TouchableOpacity
          onPress={() => setChatVisible(false)}
          style={styles.closeChatButton}
        >
          <Text style={styles.closeChatButtonText}>Close</Text>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

export default Reporting;

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
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#F2f9FB",
    elevation: 5,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginTop: 20,
  },
  list: {
    marginTop: 80,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 3,
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
    width: 200,
    height: 100,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    color: "#202A44",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 50,
  },
  horScrollView: {
    marginTop: 100,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
    justifyContent: "space-evenly",
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
});
