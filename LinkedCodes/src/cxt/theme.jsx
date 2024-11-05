import React, { createContext, useState, useContext } from 'react';

//default theme values for light and dark mode
const themes = {
  dark: {
    text: '#FFFFFF', // White text
    background: '#202A44', //navy blue background
  },
  light: {
    text: '#202A44', // Navy blue text
    background: '#F2f9FB', // Light bluish white background
  },
};

// then create the ThemeContext
const ThemeContext = createContext();

// selt created hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider component to manage theme state
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default to light theme

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
