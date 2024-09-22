import { StatusBar } from "expo-status-bar";
import { Slot } from "expo-router";
import { UserProvider } from "../src/cxt/user";
import { ReportProvider } from "../src/cxt/reports";

const _layout = () => {
  return (
    <ReportProvider>
      <UserProvider>
        <StatusBar style="light" />
        <Slot />
      </UserProvider>
    </ReportProvider>
  );
};

export default _layout;
