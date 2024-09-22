import { doc, updateDoc } from "firebase/firestore";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, Link} from "expo-router";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";
import Octicons from "@expo/vector-icons/Octicons";
import { useUser } from "../../../../src/cxt/user";

const ManageOfficials = () => {
  const [users, setUsers] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const q = query(
      collection(db, "user"),
      where("deleted", "==", false),
      where("email", "!=", user.email)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users_ = [];
      querySnapshot.forEach((doc) => {
        users_.push({ ...doc.data(), id: doc.id });
      });
      setUsers(users_);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleBlock = async (id, state) => {
    const userDocRef = doc(db, "user", id);

    await updateDoc(userDocRef, {
      blocked: !state,
    });
  };
  const handleDelete = async (id) => {
    const userDocRef = doc(db, "user", id);

    await updateDoc(userDocRef, {
      deleted: true,
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Manage Officials",
          headerRight: () => (
            <Link asChild
            href="/(tabs)/Profile/admin/add"
            >
              <Octicons name="person-add" size={24} color="black" />
            </Link>
          ),
        }}
      />
      <Text>ManageOfficials</Text>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.description}>{item.email}</Text>
            <TouchableOpacity
              onPress={() => handleBlock(item.id, item.blocked)}
            >
              {item.blocked ? (
                <Octicons name="unlock" size={24} color="black" />
              ) : (
                <Octicons name="lock" size={24} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Octicons name="trash" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </>
  );
};

export default ManageOfficials;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
  },
});
