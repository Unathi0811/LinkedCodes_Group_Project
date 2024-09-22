import { ActivityIndicator, Alert, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { app, db } from "../firebase";
import { useUser } from "../src/cxt/user";
import { doc, getDoc } from "firebase/firestore";

const _layout = () => {
  const { setUser } = useUser();
  getAuth(app).onAuthStateChanged(async (user) => {
    if (!user) return router.replace("/(auth)");

    try {
      const docRef = doc(db, "user", user.uid);
      const docSnap = await getDoc(docRef);

      let userType = false;
      if (docSnap.exists()) {
        const uData = docSnap.data();


        if (uData.blocked || uData.deleted) {
          Alert.alert("Acess Denied", "User account disabled or deleted.");
          signOut(getAuth())
          return <Redirect href="/(auth)/login"></Redirect>;
        }

        setUser({ ...uData, uid: docSnap.id });
        userType = docSnap.data().userType;
      } else {
        setUser({ uid: user.uid, email: user.email });
      }

      return userType
        ? router.replace("/(tabs)/Home")
        : router.replace("/(userTabs)/home");
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
    </View>
  );
};

export default _layout;
