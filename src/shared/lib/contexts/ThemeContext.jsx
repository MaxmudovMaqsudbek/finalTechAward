/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Theme Provider (app/providers/ThemeProvider.jsx)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
      setIsSidebarExpanded(prev => !prev);
  }

  const value = useMemo(() => ({ theme, toggleTheme, isSidebarExpanded, toggleSidebar }), [theme, isSidebarExpanded]);

  return (
    <ThemeContext.Provider value={value}>
    <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
          body {
            font-family: 'Montserrat';
          }
        `}
      </style>
      <div className={`${theme} font-[Montserrat] font-medium`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};