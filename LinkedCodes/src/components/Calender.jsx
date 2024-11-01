import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, Modal, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { auth, db } from '../../firebase'; // Ensure you have initialized Firebase correctly
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

const Calendar = () => {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Set to current date
  const [modalVisible, setModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({}); // For marking dates with activities

  useEffect(() => {
    loadItems({ timestamp: Date.now() }); // Load items for the current month on mount
  }, []);

  const loadItems = async (day) => {
    const userId = auth.currentUser.uid;
    const startDate = timeToString(day.timestamp - (day.timestamp % (24 * 60 * 60 * 1000)));
    const endDate = timeToString(day.timestamp + (24 * 60 * 60 * 1000));

    // Fetch activities for the authenticated user
    const q = query(
      collection(db, 'activities'), 
      where('userId', '==', userId), 
      
    );

    const querySnapshot = await getDocs(q);
    const newItems = {};
    const newMarkedDates = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!newItems[data.date]) {
        newItems[data.date] = [];
      }
      newItems[data.date].push({ name: data.name, height: 50 });

      // Mark this date as having an activity
      newMarkedDates[data.date] = { marked: true, dotColor: '#FFD700' };
    });

    setItems((prevItems) => ({ ...prevItems, ...newItems }));
    setMarkedDates((prevMarkedDates) => ({ ...prevMarkedDates, ...newMarkedDates }));
  };

  const addActivity = async () => {
    if (newActivity.trim() !== '') {
      setLoading(true); // Start loading
      const userId = auth.currentUser.uid;

      // Add activity to Firestore
      await addDoc(collection(db, 'activities'), {
        userId,
        date: selectedDate,
        name: newActivity,
      });

      // Update items and marked dates state
      setItems((prevItems) => {
        const newItems = { ...prevItems };
        if (!newItems[selectedDate]) {
          newItems[selectedDate] = [];
        }
        newItems[selectedDate].push({ name: newActivity, height: 50 });
        return newItems;
      });

      // Update marked dates
      setMarkedDates((prevMarkedDates) => ({
        ...prevMarkedDates,
        [selectedDate]: { marked: true, dotColor: '#fff' },
      }));

      setModalVisible(false);
      setNewActivity('');
      setLoading(false); // Stop loading
    }
  };

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarCard}>
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          selected={selectedDate}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setModalVisible(true);
          }}
          renderItem={(item) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
            </View>
          )}
          renderEmptyDate={() => {
            const activities = items[selectedDate] || [];
            console.log('Selected Date:', selectedDate);
            console.log('Activities for Selected Date:', activities);
            return (
              <View style={styles.emptyDate}>
                <Text>{activities.length === 0 ? 'No activities for this date' : ''}</Text>
              </View>
            );
          }}
          rowHasChanged={(r1, r2) => r1.name !== r2.name}
          markedDates={markedDates} // Use markedDates to show dots
          theme={{
            backgroundColor: '#202A44',
            calendarBackground: '#202A44',
            textSectionTitleColor: '#FFFFFF',
            selectedDayBackgroundColor: '#fff',
            selectedDayTextColor: '#202A44',
            todayTextColor: '#FFD700',
            dayTextColor: '#FFFFFF',
            textDisabledColor: '#808080',
            dotColor: '#FFD700',
            selectedDotColor: '#202A44',
            arrowColor: '#FFD700',
            monthTextColor: '#FFFFFF',
          }}
        />
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.title}>ACTIVITY</Text>
          <Text style={styles.activityText}>Add activity for {selectedDate}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter activity"
            placeholderTextColor={"#D3D3D3"}
            value={newActivity}
            onChangeText={setNewActivity}
            multiline
            numberOfLines={5}
          />

          {loading ? ( // Show loading indicator while adding activity
            <ActivityIndicator size="large" color="#202A44" />
          ) : (
            <View style={styles.buttons}>
              <Pressable style={styles.button} onPress={addActivity}>
                <Text style={styles.buttonText}>Add Activity</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  calendarCard: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
  },
  emptyDate: {
    padding: 10,
    marginRight: 10,
    marginTop: 17,
    borderRadius: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 123,
  },
  input: {
    borderColor: '#202A44',
    borderWidth: 2,
    padding: 10,
    width: '80%',
    maxHeight: "44%",
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '80%',
  },
  button: {
    backgroundColor: '#202A44',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activityText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#202A44',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#202A44',
    fontWeight: "bold",
  },
});

export default Calendar;

