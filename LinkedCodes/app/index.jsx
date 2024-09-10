import { ActivityIndicator, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { getAuth } from "firebase/auth";
import { app, db } from "../firebase";
import { useUser } from "../src/cxt/user";
import { doc, getDoc  } from "firebase/firestore";

const _layout = () => {

  const {setUser } = useUser();

  getAuth(app).onAuthStateChanged(async (user) => {
    if (!user) return router.replace("/(auth)");

    // get the user from db
    const docRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(docRef);
    //create a variable called type
    let userType = false;

    if (docSnap.exists()) {
      setUser({...docSnap.data(), uid: docSnap.id});
      userType = docSnap.data().userType;
    } else {
      setUser({ uid: user.uid, email: user.email });
    }
    return userType? router.replace("/(tabs)/Mantain") : router.replace("/(userTabs)/home");
  });


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

export default _layout;
