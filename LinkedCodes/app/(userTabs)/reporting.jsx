import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useReport } from '../../src/cxt/reports';

const AdminReporting = () => {
  const { report } = useReport();
  const [visibleCount, setVisibleCount] = useState(3); 

  const renderItem = ({ item }) => (
    <View key={item.date_created} style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: item.image[0] }} style={styles.reportImage} />
      </View>
      <View style={styles.reportContainer}>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>{item.date_created}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={report.slice(0, visibleCount)} 
        renderItem={renderItem}
        keyExtractor={(item) => item.date_created}
        ListFooterComponent={
          visibleCount < report.length && (
            <TouchableOpacity
              style={styles.moreButton}
              onPress={() => setVisibleCount(visibleCount + 3)} 
            >
              <Text style={styles.moreButtonText}>Show More</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  reportImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  reportContainer: {
    flex: 1,
    marginLeft: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  moreButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  moreButtonText: {
    fontSize: 16,
    color: '#202A44',
  },
});

export default AdminReporting;
