import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { UserProvider } from "../src/cxt/user";

const _layout = () => {
  return (
    <UserProvider>
      <StatusBar style="light" />
      <Slot />
    </UserProvider>
  );
};

export default _layout;
