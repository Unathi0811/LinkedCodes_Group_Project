import React, { useState } from 'react'; 
import { View, Text, TextInput, Button, Modal, StyleSheet, Dimensions, Pressable} from 'react-native';
import { Agenda } from 'react-native-calendars';

const Calendar = () => {
  const [items, setItems] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newActivity, setNewActivity] = useState('');

  // Load items for the calendar dates
  const loadItems = (day) => {
    setTimeout(() => {
      const newItems = { ...items };
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!newItems[strTime]) {
          newItems[strTime] = [];
        }
      }
      setItems(newItems);
    }, 1000);
  };

  // Convert timestamp to string date (YYYY-MM-DD)
  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  // Handle adding a new activity
  const addActivity = () => {
    if (newActivity.trim() !== '') {
      const newItems = { ...items };
      if (!newItems[selectedDate]) {
        newItems[selectedDate] = [];
      }
      newItems[selectedDate].push({
        name: newActivity,
        height: 50,
      });
      setItems(newItems);
      setModalVisible(false); // Close modal
      setNewActivity(''); // Reset the input field
    }
  };

  // Render the agenda
  return (
    <View style={styles.container}>
      <View style={styles.calendarCard}>
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          selected={selectedDate || '2024-09-05'}
          onDayPress={(day) => {
            setSelectedDate(day.dateString); // Set the clicked date
            setModalVisible(true); // Open the modal to add activity
          }}
          renderItem={(item) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
            </View>
          )}
          renderEmptyDate={() => (
            <View style={styles.emptyDate}>
              <Text>No activities for this date</Text>
            </View>
          )}
          rowHasChanged={(r1, r2) => r1.name !== r2.name}
          
          // Theme for the calendar
          theme={{
            backgroundColor: '#202A44', // background
            calendarBackground: '#202A44', // calendar background
            textSectionTitleColor: '#FFFFFF', // section titles (weekdays)
            selectedDayBackgroundColor: '#FFFFFF', // selected day
            selectedDayTextColor: '#202A44', // text on selected day
            todayTextColor: '#FFD700', // text for today's date
            dayTextColor: '#FFFFFF', // dates text
            textDisabledColor: '#808080', // for disabled dates
            dotColor: '#FFD700', // dot for days with items
            selectedDotColor: '#202A44', // dot for selected day
            arrowColor: '#FFD700', // arrows
            monthTextColor: '#FFFFFF', // month text
          }}
        />
      </View>

      {/* Modal for adding a new activity */}
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
          />

        <View style={styles.buttons}>
            <Pressable style={styles.button} onPress={addActivity}>
              <Text style={styles.buttonText}>Add Activity</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
        </View>
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
  },
  input: {
    borderColor: '#202A44',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: '80%',
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
