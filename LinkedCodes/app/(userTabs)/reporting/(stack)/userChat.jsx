import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
	SafeAreaView,
	ActivityIndicator,
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { auth, db } from "../../../../firebase"; // Adjust path as necessary
import {
	addDoc,
	collection,
	onSnapshot,
	query,
	orderBy,
	where,
	getDoc,
	doc,
} from "firebase/firestore";
import Icon2 from "react-native-vector-icons/MaterialIcons";

export default function Chat() {
	const [messages, setMessages] = useState([]);
	const [loadingChat, setLoadingChat] = useState(true);
	const [chatVisible, setChatVisible] = useState(false);
	const [userAvatars, setUserAvatars] = useState({});
	const [chatUsername, setChatUsername] = useState(""); // Store the username for the chat user

	const currentUserId = auth.currentUser.uid;
	const chatUserId = "PT6qntSSCJW9Ob1oNXGzjoBv9op1"; // Replace this with the target user's ID
	const chatId = [currentUserId, chatUserId].sort().join("_");

	// Fetch avatar and username for chat user
	const fetchUserData = async (userId, setUsername = false) => {
		if (userAvatars[userId]) return;

		try {
			const userDoc = await getDoc(doc(db, "user", userId));
			if (userDoc.exists()) {
				const userData = userDoc.data();
				setUserAvatars((prev) => ({
					...prev,
					[userId]:
						userData.profileImage ||
						"https://via.placeholder.com/60",
				}));
				if (setUsername) {
					setChatUsername(userData.username || "Unknown User");
				}
			}
		} catch (error) {
			console.error(`Error fetching data for user ${userId}:`, error);
			if (setUsername) setChatUsername("Unknown User");
		}
	};

	useEffect(() => {
		fetchUserData(currentUserId);
		fetchUserData(chatUserId, true); // Fetch username for chat user
	}, [currentUserId, chatUserId]);

	useEffect(() => {
		const collectionRef = collection(db, "chats");
		const q = query(
			collectionRef,
			where("chatId", "==", chatId),
			orderBy("createdAt", "desc")
		);

		const unsubscribe = onSnapshot(q, (snapshot) => {
			setLoadingChat(true);
			setMessages(
				snapshot.docs.map((doc) => {
					const data = doc.data();
					return {
						_id: doc.id,
						text: data.text,
						createdAt: data.createdAt?.toDate(),
						user: {
							_id: data.user._id,
							avatar:
								userAvatars[data.user._id] ||
								"https://via.placeholder.com/60",
						},
					};
				})
			);
			setLoadingChat(false);
		});

		return () => unsubscribe(); // Cleanup on component unmount
	}, [chatId, userAvatars]);

	const onSend = useCallback(
		(messages = []) => {
			const { _id, createdAt, text } = messages[0];

			addDoc(collection(db, "chats"), {
				_id,
				createdAt,
				text,
				user: {
					_id: currentUserId,
					avatar:
						userAvatars[currentUserId] ||
						"https://via.placeholder.com/60",
				},
				chatId,
			});

			setMessages((previousMessages) =>
				GiftedChat.append(previousMessages, messages)
			);
		},
		[chatId, currentUserId, userAvatars]
	);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TouchableOpacity
				onPress={() => setChatVisible(true)}
				style={{ padding: 20 }}
			>
				<Text style={{ fontSize: 18, color: "blue" }}>Open Chat</Text>
			</TouchableOpacity>

			<Modal
				visible={chatVisible}
				onRequestClose={() => setChatVisible(false)}
				animationType="slide"
			>
				<SafeAreaView style={styles.chatContainer}>
					<View style={styles.chatHeader}>
						<Text style={styles.chatTitle}>
							Chat with {chatUsername}{" "}
							{/* Display the username */}
						</Text>
						<TouchableOpacity onPress={() => setChatVisible(false)}>
							<Icon2
								name="close"
								size={24}
								color="#202A44"
							/>
						</TouchableOpacity>
					</View>
					<GiftedChat
						messages={messages}
						onSend={(messages) => onSend(messages)}
						user={{
							_id: currentUserId, // Current user's ID
						}}
						renderLoading={() => (
							<ActivityIndicator
								size="large"
								color="#202A44"
							/>
						)}
					/>
					{loadingChat && (
						<ActivityIndicator
							size="large"
							color="#202A44"
						/>
					)}
				</SafeAreaView>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
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
