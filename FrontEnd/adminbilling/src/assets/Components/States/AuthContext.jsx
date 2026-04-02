import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }

  setLoading(false);
}, []);

 const login = async (username, password) => {
  const res = await axios.post("http://localhost:5454/api/auth/login", {
    username,
    password,
  });
console.log("LOGIN RESPONSE:", res.data);
  const data = res.data;

  const userData = {
    userId: data.userId,
    role: data.role,
    shopId: data.shopId,
    employeeId: data.employeeId,
    shopName: data.shopName,
    profileCompleted: data.profileCompleted,
  };

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(userData));

  setToken(data.token);
  setUser(userData);
};

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
