import { createContext, useContext, useState, useEffect } from "react";
import { adminAPI } from "../utils/api";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing admin session on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedToken = localStorage.getItem("adminToken");
    if (storedAdmin && storedToken) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin");
    }
  }, [admin]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await adminAPI.login(credentials);
      
      if (response.token) {
        localStorage.setItem("adminToken", response.token);
        setAdmin(response.admin);
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      return { success: false, message: error.message || "Invalid credentials" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
