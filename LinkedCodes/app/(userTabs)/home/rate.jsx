import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { auth, db } from "../../../firebase";
import { useTheme } from '../../../src/cxt/theme'; // Import the useTheme hook
import globalStyles from '../../../src/cxt/globalstyle'; // Import global styles

const RateUs = () => {
  const { theme } = useTheme(); // Access the current theme
  const styles = globalStyles(theme); // Get styles based on the current theme
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 0,
    comment: '',
  });

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
    <View style={styles.reviewContainer}>
      <View style={styles.reviewContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.newReviewContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          placeholderTextColor="#aaa"
          value={newReview.userName}
          onChangeText={(text) => setNewReview({ ...newReview, userName: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Your Comment"
          placeholderTextColor="#aaa"
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

export default RateUs;
