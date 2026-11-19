"use client";

// Import React hooks for managing state and side effects
import React, { createContext, useContext, useEffect, useState } from "react";

// Allowed theme types
type Theme = "light" | "dark";

// Context properties interface
interface ThemeContextType {
  // Current active theme
  theme: Theme;
  // Function to toggle between light and dark themes
  toggleTheme: () => void;
}

// Create the React Context with undefined initial value
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component wrapping the app to give all children access to theme state
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // State storing whether we are currently in light or dark mode
  const [theme, setTheme] = useState<Theme>("dark");
  // State tracking whether component has mounted in the browser
  const [mounted, setMounted] = useState<boolean>(false);

  // Run once on initial browser mount to read saved preferences
  useEffect(() => {
    // Mark as mounted
    setMounted(true);
    // Check if user previously saved a theme preference in localStorage
    const savedTheme = localStorage.getItem("lexagent-theme") as Theme | null;
    // If a saved preference exists, use it
    if (savedTheme) {
      setTheme(savedTheme);
      // If dark theme is chosen, add the 'dark' class to the root document element
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default to dark theme for modern high-tech aesthetic
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Function to switch between light and dark
  const toggleTheme = () => {
    // Calculate new theme
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    // Update React state
    setTheme(nextTheme);
    // Save to localStorage so preference survives page refreshes
    localStorage.setItem("lexagent-theme", nextTheme);
    // Update the class list on <html> element
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Always provide the ThemeContext so server-side rendering and child components never see an undefined context
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to consume the theme context easily in any component
export function useTheme() {
  // Read context
  const context = useContext(ThemeContext);
  // Throw descriptive error if used outside ThemeProvider
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  // Return the theme context
  return context;
}
