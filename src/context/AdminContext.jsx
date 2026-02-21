import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

// Hardcoded admin credentials
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
  email: "admin@shopx.com"
};

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  );

  useEffect(() => {
    localStorage.setItem("admin", JSON.stringify(admin));
  }, [admin]);

  const login = (credentials) => {
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      const adminData = {
        username: ADMIN_CREDENTIALS.username,
        email: ADMIN_CREDENTIALS.email,
        role: "admin"
      };
      setAdmin(adminData);
      localStorage.setItem("admin", JSON.stringify(adminData));
      return { success: true };
    }
    return { success: false, message: "Invalid credentials" };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
