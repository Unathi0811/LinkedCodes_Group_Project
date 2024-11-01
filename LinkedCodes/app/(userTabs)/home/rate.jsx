import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth, db } from "../../../firebase";
import { useRouter } from 'expo-router';
import Icon from "react-native-vector-icons/FontAwesome"
const RateUs = ({ isDarkMode }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 0,
    comment: '',
  });
  const router = useRouter()
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, 'reviews');
      const reviewsSnapshot = await getDocs(reviewsCollection);
      const reviewsList = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsList);
    };
    fetchReviews();
  }, []);

  const handleAddReview = async () => {
    if (newReview.userName && newReview.comment && newReview.rating > 0) {
      try {
        await addDoc(collection(db, 'reviews'), newReview);
        setReviews([...reviews, { ...newReview, id: (reviews.length + 1).toString() }]);
        setNewReview({
          userName: '',
          rating: 0,
          comment: '',
        });
      } catch (error) {
        console.error('Error adding review:', error);
        Alert.alert('Error', 'Could not add review. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please provide a name, rating, and comment.');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={styles.star}>
        {index < rating ? '★' : '☆'}
      </Text>
    ));
  };

  const renderReview = ({ item }) => (
    <View style={[styles.reviewContainer, { backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF' }]}>
      <View style={styles.reviewContent}>
        <Text style={[styles.userName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.userName}</Text>
        <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
        <Text style={[styles.comment, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000000' : '#EAF1FF' }]}>
      <View style={styles.header}>
					{/* Back Button */}
					<TouchableOpacity
						onPress={() => router.push("/(userTabs)/home")}
						style={styles.backButton}
					>
						<Icon
							name="arrow-left"
							size={20}
							color="#202A44"
						/>
					</TouchableOpacity>
					<Text style={styles.headerApp}>InfraSmart</Text>
				</View>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={[styles.newReviewContainer, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? '#333333' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }]}
          placeholder="Your Name"
          placeholderTextColor={isDarkMode ? '#aaaaaa' : '#aaa'}
          value={newReview.userName}
          onChangeText={(text) => setNewReview({ ...newReview, userName: text })}
        />
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? '#333333' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }]}
          placeholder="Your Comment"
          placeholderTextColor={isDarkMode ? '#aaaaaa' : '#aaa'}
          value={newReview.comment}
          onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
        />
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity key={num} onPress={() => setNewReview({ ...newReview, rating: num })}>
              <Text style={styles.star}>{num <= newReview.rating ? '★' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddReview}>
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 20,
    marginTop: 94
  },
  reviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'flex-start',
  },
  reviewContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  star: {
    fontSize: 18,
    color: '#FFD700',
    marginRight: 2,
  },
  comment: {
    fontSize: 14,
  },
  newReviewContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#202A44',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
		position: "absolute",
		left: 0,
		right: 0,
		flexDirection: "row",
		alignContent: "space-between",
		alignItems: "center",
		padding: 20,
		zIndex: 10,
		backgroundColor: "#fff",
		height: 100,
		marginBottom: 5,
		borderBlockEndColor: "#ccc",
	},
	backButton: {
		padding: 10,
		marginRight: 10,
	},
	headerApp: {
		fontSize: 25,
		fontWeight: "bold",
		color: "#202A44",
		marginLeft: 130,
	},
});

export default RateUs;
