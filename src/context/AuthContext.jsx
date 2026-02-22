import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData.user || userData);
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("loggedInUser");
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user || response);
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return { success: false, message: error.message || "Invalid credentials" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.token) {
        localStorage.setItem("token", response.token);
        setUser(response.user || response);
        return { success: true };
      }
      return { success: false, message: "Registration failed" };
    } catch (error) {
      return { success: false, message: error.message || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
  };

  const updateUser = async (updates) => {
    try {
      const response = await authAPI.updateProfile(updates);
      const updatedUser = { ...user, ...response.user };
      setUser(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
