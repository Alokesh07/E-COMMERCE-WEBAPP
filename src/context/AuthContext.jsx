import { createContext, useContext, useState, useEffect } from "react";
import seedData from "../data/users.seed.json";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser")) || null
  );

  // Initialize seed users if not exists
  useEffect(() => {
    const existingUsers = localStorage.getItem("users");
    if (!existingUsers || existingUsers === "[]") {
      localStorage.setItem("users", JSON.stringify(seedData.users));
    }
  }, []);

  const login = (userData) => {
    // Ensure user has addresses
    const userWithAddresses = {
      ...userData,
      addresses: userData.addresses || [],
      phone: userData.phone || ''
    };
    setUser(userWithAddresses);
    localStorage.setItem("loggedInUser", JSON.stringify(userWithAddresses));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    
    // Also update in users list
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
