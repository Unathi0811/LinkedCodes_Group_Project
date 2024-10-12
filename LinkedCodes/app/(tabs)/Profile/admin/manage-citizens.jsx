import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, Link } from "expo-router";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../../../firebase";
import Octicons from "@expo/vector-icons/Octicons";
import { useUser } from "../../../../src/cxt/user";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { user } = useUser(); // Get current user data
  const [notifications, setNotifications] = useState([]);

  // Fetch all users from Firestore and exclude the admin (where admin === true)
  useEffect(() => {
    const q = query(collection(db, "user"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users_ = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        // Exclude admin users by checking if the `admin` field exists and is true
        if (!userData.admin) {
          users_.push({ ...userData, id: doc.id });
        }
      });
      setUsers(users_);
    });

    return () => {
      unsubscribe();
    };
  }, []);  // No need to depend on `user.id` anymore

  // Block or unblock a user
  const handleBlock = async (id, state) => {
    try {
      const userDocRef = doc(db, "user", id);
      await updateDoc(userDocRef, {
        blocked: !state,  // Toggle block status
      });
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };

  // Delete (and remove) a user from Firestore
  const handleDelete = async (id) => {
    try {
      const userDocRef = doc(db, "user", id);
      await deleteDoc(userDocRef);  // Permanently remove the user
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const placeholderImage = "https://via.placeholder.com/60"

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerBackTitleVisible: false,
          headerTintColor: "#202A44",
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
              <Link asChild href="/(tabs)/Profile/admin/add">
                <Octicons name="person-add" size={24} color="black" />
              </Link>
              <TouchableOpacity onPress={() => {/* Navigate to notifications screen */}}>
                <View style={{ position: 'relative' }}>
                  <Octicons name="bell" size={21} color="black" />
                  {notifications.length > 0 && (
                    <View style={{
                      position: 'absolute',
                      right: -5,
                      top: -5,
                      backgroundColor: 'red',
                      borderRadius: 10,
                      padding: 5,
                      minWidth: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Text style={{ color: 'white', fontSize: 12 }}>{notifications.length}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* Display Active Users */}
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.profileContainer}>
              <Image source={{ uri: item.profileImage || placeholderImage}} style={styles.profileImage} />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.username}</Text>
                <Text style={styles.description}>{item.email}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              {/* Block/Unblock Button */}
              <TouchableOpacity style={styles.button} onPress={() => handleBlock(item.id, item.blocked)}>
                {item.blocked ? (
                  <Octicons name="unlock" size={24} color="#202A44" />
                ) : (
                  <Octicons name="lock" size={24} color="#202A44" />
                )}
              </TouchableOpacity>

              {/* Delete (and Remove) Button */}
              <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
                <Octicons name="trash" size={24} color="#202A44" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 18, color: "#202A44" },
  description: { fontSize: 14, color: "#202A44" },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    padding: 10,
    marginLeft: 10,
  },
});

export default ManageUsers;
