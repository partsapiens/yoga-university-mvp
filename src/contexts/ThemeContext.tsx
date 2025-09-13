"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  // Initialize theme from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for existing preferences (support both old and new keys)
      const savedTheme = localStorage.getItem('yoga_theme') || 
                        (localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light');
      
      const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
      setThemeState(initialTheme);
      
      // Apply theme to document
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Clean up old localStorage key if it exists
      if (localStorage.getItem('darkMode')) {
        localStorage.removeItem('darkMode');
      }
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    if (typeof window !== 'undefined') {
      // Update localStorage
      localStorage.setItem('yoga_theme', newTheme);
      
      // Update document class
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};