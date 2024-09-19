import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Modal from "react-native-modal";

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#202A44",
    marginBottom: 20,
  },
  carouselContainer: {
    marginBottom: 20,
  },
  reviewCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reviewInputContainer: {
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#202A44",
  },
  textInput: {
    borderColor: "#202A44",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: "top",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#202A44",
  },
  modalInput: {
    borderColor: "#202A44",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    height: 100,
  },
});

const RateUs = () => {
  const [isExperienceModalVisible, setExperienceModalVisible] = useState(false);
  const [isImproveModalVisible, setImproveModalVisible] = useState(false);
  const [isThankYouModalVisible, setThankYouModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const reviews = [
    { id: "1", text: "Great app! Very useful." },
    { id: "2", text: "I love the interface and functionality." },
    { id: "3", text: "Had some bugs, but support was excellent." },
  ];

  const handleReviewSubmit = () => {
    setThankYouModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Rate Us</Text>

        <View style={styles.carouselContainer}>
          <Carousel
            data={reviews}
            width={screenWidth}
            height={screenWidth / 2}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Text>{item.text}</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.reviewInputContainer}>
          <Text style={styles.inputTitle}>Share your experience:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write your review here..."
            value={reviewText}
            onChangeText={setReviewText}
            multiline
          />
          <Button title="Submit Review" onPress={handleReviewSubmit} />
        </View>
      </ScrollView>

      <Modal
        isVisible={isExperienceModalVisible}
        onBackdropPress={() => setExperienceModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Rate Your Experience</Text>
          <TextInput style={styles.modalInput} placeholder="Rate from 1 to 5" />
          <Button
            title="Submit"
            onPress={() => setExperienceModalVisible(false)}
          />
        </View>
      </Modal>

      <Modal
        isVisible={isImproveModalVisible}
        onBackdropPress={() => setImproveModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>What Can We Improve?</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Your suggestions"
            multiline
          />
          <Button
            title="Submit"
            onPress={() => setImproveModalVisible(false)}
          />
        </View>
      </Modal>

      <Modal
        isVisible={isThankYouModalVisible}
        onBackdropPress={() => setThankYouModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Thank You!</Text>
          <Text>Thank you for your feedback.</Text>
          <Button
            title="Close"
            onPress={() => setThankYouModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default RateUs;
