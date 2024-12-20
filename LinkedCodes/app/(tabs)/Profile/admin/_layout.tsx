import React from "react";
import { Redirect, Stack } from "expo-router";
import { useUser } from "../../../../src/cxt/user";

const Layout = () => {
  const { user } = useUser();

  if (!user?.admin) return <Redirect href="/(tabs)/Profile" />;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTintColor: "#202A44",
          headerBackTitleVisible: false,
        }}
      />
    </>
  );
};

export default Layout;
