import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, Tabs } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome"

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_KEY = "AIzaSyARHJ5rNKWC_b9f56ZCUBPa9oVW9JVCc34";

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const prompt = "Hi";
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setMessages([{ text, user: false }]);
    };
    startChat();
  }, []);

  const sendMessage = async () => {
    // To avoid a user from sendin an empty message
    if (!userInput.trim()) return;
    setLoading(true);

    //
    const userMessage = { text: userInput, user: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
    const prompt = userMessage.text;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
    } catch (error) {
      setErrorMessage("Failed to generate response. Please try again.");
      setModalVisible(true); 
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text style={{ fontSize: 16 }}>{item.text}</Text>
    </View>
  );
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Chat",
          headerStyle: { fontSize: 25 },
          headerBackTitle: "Home",
          // headerBackTitleStyle:{}
          headerTintColor: "#202A44",
          headerTitleStyle:{
            color: "#202A44",
            fontSize: 24
          }
        }}
      />
      <Tabs.Screen
        options={{
          tabBarStyle: {
            height: 0,
            display: "none",
          },
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#F2f9FB", padding: 10 }}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
        />
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <TextInput
            placeholder="Type a message"
            onChangeText={setUserInput}
            value={userInput}
            style={{
              flex: 1,
              padding: 10,
              backgroundColor: "#B7C9F2",
              borderRadius: 10,
              height: 50,
            }}
            placeholderTextColor="black"
          />

          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: "#F2f9FB",
              borderRadius: 25,
              height: 50,
              width: 50,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 6,
            }}
            onPress={sendMessage}
          >
            <FontAwesome name="send" size={24} color="#202A44" />
          </TouchableOpacity>

        </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
          <Icon
							name="exclamation"
							size={30}
							color="#F2f9FB"
              style={{marginBottom:30}}
						/>
            <Text style={styles.message}>{errorMessage}</Text>
            {/* <Button title="OK" onPress={handleCloseModal} /> */}
            <TouchableOpacity
                style={styles.OKButton}
                onPress={handleCloseModal}
              >
              <Text style={styles.btnText}> OK </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 5 },

  userMessage: {
    backgroundColor: "#cce5ff",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#e2e3e5",
    alignSelf: "flex-start",
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#202A44',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    marginBottom: 20,
    color:'#F2f9FB',
    fontSize: 18,
  },
  btnText: {
    color: '#202A44',
    fontWeight: 'bold',
    fontSize:20,
  },
  OKButton:{
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#F2f9FB',
    borderRadius: 5,
    marginLeft: 5,
  }
});
export default ChatBot;
