// import React from 'react';
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import Carousel from 'react-native-snap-carousel';

// const feedbackData = [
//   {
//     name: 'Lisa Redfern',
//     image: 'https://c2.staticflickr.com/8/7310/buddyicons/24846422@N06_r.jpg',
//     review: 'InfraSmart has been a game-changer for our infrastructure management. The real-time monitoring is spot-on, and the predictive maintenance feature helps us prevent major issues. The data visualization tools are top-notch, making it easy to understand complex information at a glance.',
//     rating: 5,
//   },
//   {
//     name: 'Cassi',
//     image: 'https://res.cloudinary.com/hnmqik4yn/image/upload/c_fill,fl_force_strip,h_128,q_100,w_128/v1493982718/ah57hnfnwxkmsciwivve.jpg',
//     review: 'I’ve found InfraSmart to be incredibly useful. The app’s predictive maintenance capabilities have allowed us to stay ahead of potential issues. It’s easy to use and the support team is responsive. The only improvement I’d suggest is adding more customization options for reports.',
//     rating: 4,
//   },
//   {
//     name: 'Md Nahidul',
//     image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/451270/profile/profile-80.jpg',
//     review: 'InfraSmart’s live status updates and issue reporting features are fantastic. The app’s ability to track infrastructure conditions and provide timely alerts has significantly improved our maintenance processes. The analytics dashboard is also very helpful for decision-making.',
//     rating: 5,
//   },
//   {
//     name: 'Jessica Doe',
//     image: 'https://c2.staticflickr.com/8/7310/buddyicons/24846422@N06_r.jpg',
//     review: 'As a city planner, InfraSmart has become an indispensable tool for managing urban infrastructure. The app’s predictive maintenance feature is spot-on, helping us prioritize repairs efficiently. The user interface is sleek and easy to navigate, making our job much easier.',
//     rating: 4,
//   },
//   {
//     name: 'John Smith',
//     image: 'https://res.cloudinary.com/hnmqik4yn/image/upload/c_fill,fl_force_strip,h_128,q_100,w_128/v1493982718/ah57hnfnwxkmsciwivve.jpg',
//     review: 'InfraSmart is a comprehensive solution for infrastructure management. The real-time updates and data analytics have provided us with valuable insights, helping us improve our maintenance strategies. It’s a reliable app that has saved us both time and resources.',
//     rating: 5,
//   },
// ];

// const FeedbackScreen = () => {
//   const renderItem = ({ item }) => (
//     <View style={styles.feedbackItem}>
//       <Image source={{ uri: item.image }} style={styles.profileImage} />
//       <Text style={styles.customerName}>{item.name}</Text>
//       <Text style={styles.customerReview}>{item.review}</Text>
//       <View style={styles.rating}>
//         <Text style={styles.ratingText}>{item.rating}</Text>
//         {/* You can use a star icon here if you prefer */}
//         <Text>⭐</Text>
//       </View>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>What Clients Say</Text>
//       </View>

//       <Carousel
//         data={feedbackData}
//         renderItem={renderItem}
//         sliderWidth={400}
//         itemWidth={300}
//         loop
//         autoplay
//       />

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>Me On:</Text>
//         <View style={styles.linksContainer}>
//           <TouchableOpacity>
//             <Text style={styles.link}>Toptal</Text>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Text style={styles.link}>Upstack</Text>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Text style={styles.link}>UpWork</Text>
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Text style={styles.link}>Fiverr</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F7F7F7',
//     padding: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
//   feedbackItem: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   profileImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     marginBottom: 10,
//   },
//   customerName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   customerReview: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   rating: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   ratingText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginRight: 5,
//   },
//   footer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   linksContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   link: {
//     color: '#007BFF',
//     marginHorizontal: 10,
//   },
// });

// export default FeedbackScreen;
