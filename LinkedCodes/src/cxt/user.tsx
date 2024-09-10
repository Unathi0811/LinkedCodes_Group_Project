// create a user context, and provide a user object to the context, and a function to update the user object, and a hook

import React, { createContext, useContext, useState } from "react";

// create a user context
const UserContext = createContext(
  {} as {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  }
);

// create a user provider

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// create a user hook

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// user object tnterface

export interface User {
  uid: string;
  username: string;
  email: string;
  profileImage: string;
  phone: string;
  userType ?: boolean;
}
