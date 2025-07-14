import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to safely access localStorage
  const getStorageItem = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  };

  // Helper function to safely set localStorage
  const setStorageItem = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  };

  // Helper function to safely remove from localStorage
  const removeStorageItem = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  };

  useEffect(() => {
    const storedUser = getStorageItem("user");
    const storedToken = getStorageItem("token");

    // Validate and set user data
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        // Clean up invalid data
        removeStorageItem("user");
        setUser(null);
      }
    }

    // Validate and set token
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  const login = (userData, authToken) => {
    // Validate input parameters
    if (!userData || !authToken) {
      console.error("Login failed: userData and authToken are required");
      return false;
    }

    try {
      // Update state first
      setUser(userData);
      setToken(authToken);

      // Then update localStorage
      const userStored = setStorageItem("user", JSON.stringify(userData));
      const tokenStored = setStorageItem("token", authToken);

      if (!userStored || !tokenStored) {
        console.warn(
          "Warning: Some data may not have been stored in localStorage"
        );
      }

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    // Update state first
    setUser(null);
    setToken(null);

    // Then clear localStorage
    removeStorageItem("user");
    removeStorageItem("token");
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
