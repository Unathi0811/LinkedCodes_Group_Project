import React, { useState, useEffect } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "AIzaSyARHJ5rNKWC_b9f56ZCUBPa9oVW9JVCc34";

  useEffect(() => {
    const startChat = async () => {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "tunedModels/linked-sfiswuck2nye" });
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
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "tunedModels/linked-sfiswuck2nye" });
    const prompt = userMessage.text;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setMessages(prevMessages => [...prevMessages, { text, user: false }]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setLoading(false);
      setUserInput(""); 
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.user ? styles.userMessage : styles.botMessage]}>
      <Text style={{ fontSize: 16 }}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#EAF1FF",padding:10 }}>
      <Text style={{fontSize:25, alignItems:'center', justifyContent:'center',marginTop: 10,marginBottom: 20}}> Chat</Text>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          style={{flex: 1,padding: 10,backgroundColor: "#B7C9F2",borderRadius: 10,height: 50,}}
          placeholderTextColor="black"
        />

          <TouchableOpacity style={{
                  padding: 10,
                  backgroundColor: "#EAF1FF",
                  borderRadius: 25,
                  height: 50,
                  width: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 6,
                }} 
              onPress={sendMessage}>
          <FontAwesome name="send" size={24} color="#202A44" />
        </TouchableOpacity>
        {/* {loading && <ActivityIndicator size="small" color="black" />} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: { padding: 10, marginVertical: 5, borderRadius: 5 },

  userMessage: {
    backgroundColor: '#cce5ff',
    alignSelf: 'flex-end',

  },
  botMessage: {
    backgroundColor: '#e2e3e5',
    alignSelf: 'flex-start',
  },
});
export default ChatBot;

