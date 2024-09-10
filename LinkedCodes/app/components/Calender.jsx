import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
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
    <View style={{ flex: 1 }}>
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
          backgroundColor: '#000000', // background
          calendarBackground: '#000000', // calendar background
          textSectionTitleColor: '#808080', //  section titles (weekdays)
          selectedDayBackgroundColor: '#D8CA0C', //  selected day
          selectedDayTextColor: '#000000', // text on selected day
          todayTextColor: '#FFFFFF', // text for today's date
          dayTextColor: '#FFFFFF', // dates text
          textDisabledColor: '#808080', //for disabled dates
          dotColor: '#FFD700', //  dot for days with items
          selectedDotColor: '#FFFFFF', //dot for selected day
          arrowColor: '#808080', // arrows
          monthTextColor: '#808080', // month text
        }}
      />

      {/*Modal for adding a new activity */}

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
            <Text style={styles.title}>ACTIVITY</Text>
          <Text style={styles.activityText}>Add activity for {selectedDate}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter activity"
            value={newActivity}
            onChangeText={setNewActivity}
          />
          <View style={styles.buttons}>
          <Button   color="#000"title="Add Activity" onPress={addActivity} />
          <Button color="#000" title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:"#D8CA0C"
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginBottom: 10,
  },
  buttons:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginTop:30,
    width:"80%"
  },
  activityText:{
    fontSize:15,
    marginBottom:10
  },
  title:{
    fontSize:40,
    marginBottom:30
  }
});

export default Calendar;

