import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { db, auth } from '../../../firebase'; // Adjust these imports based on your directory structure
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { LogBox } from 'react-native';
import { useUser } from '../../../src/cxt/user';

LogBox.ignoreLogs([
  '[Reanimated] Reduced motion setting is enabled on this device.',
]);
import { useRouter } from 'expo-router';
import Icon from "react-native-vector-icons/FontAwesome"
const RateUs = ({ isDarkMode }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 0,
    comment: '',
    timestamp: '',
  });
  const router = useRouter()  
  const { user } = useUser(); // Use the user context

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (auth.currentUser) {
        const reviewsCollectionRef = collection(db, 'reviews');
        const q = query(reviewsCollectionRef, where('uid', '==', auth.currentUser.uid));
        const reviewsSnapshot = await getDocs(q);
        const reviewsList = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);
      }
    };

    fetchUserReviews();
  }, []);

  const handleAddReview = async () => {
    const trimmedComment = newReview.comment.trim();

    if (reviews.length >= 2) {
      Alert.alert('Error', 'You can only submit up to 2 comments.');
      return;
    }

    if (user.username && trimmedComment && newReview.rating > 0) {
      try {
        const reviewWithTimestamp = {
          ...newReview,
          uid: auth.currentUser.uid, // Add the user's unique identifier
          userName: user.username, // Use the username from the user context
          comment: trimmedComment,
          timestamp: new Date().toISOString(),
        };
        const docRef = await addDoc(collection(db, 'reviews'), reviewWithTimestamp);
        setReviews([...reviews, { id: docRef.id, ...reviewWithTimestamp }]);
        setNewReview({
          userName: user.username, // Reset the userName based on user context
          rating: 0,
          comment: '',
          timestamp: '',
        });
      } catch (error) {
        console.error('Error adding review:', error);
        Alert.alert('Error', 'Could not add review. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please provide a rating and a non-empty comment.');
    }
  };

  const renderReview = ({ item }) => (
    <View style={[styles.reviewContainer, { backgroundColor: isDarkMode ? '#2C2C2C' : '#FFFFFF' }]}>
      <View style={styles.reviewContent}>
        <Text style={[styles.userName, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
         {user.username}
        </Text>
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }, (_, index) => (
            <Text key={index} style={styles.star}>
              {index < item.rating ? '★' : '☆'}
            </Text>
          ))}
        </View>
        <Text style={[styles.comment, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
          {item.comment}
        </Text>
        <Text style={[styles.timestamp, { color: isDarkMode ? '#AAAAAA' : '#444444' }]}>
          Submitted on: {new Date(item.timestamp).toLocaleString()}
        </Text>
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
