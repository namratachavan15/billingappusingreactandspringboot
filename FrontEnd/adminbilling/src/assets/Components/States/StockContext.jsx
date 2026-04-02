import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { api } from "../Config/api";
import { useAuth } from "./AuthContext";

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [stocks, setStocks] = useState([]);
const { user } = useAuth();
 const fetchStocks = async () => {
  if (!user || user.role === "ADMIN") return;

  try {
    const res = await api.get("/api/stocks");
    console.log("response", res.data);
    setStocks(res.data);
  } catch (err) {
    console.error("Stock fetch error:", err);
  }
};
  
  const increaseStock = async (productId, sizeId, qty) => {
    await api.post("/api/stocks/increase", null, {
      params: { productId, sizeId, qty },
    });
    fetchStocks();
  };

 useEffect(() => {
  if (user) {
    fetchStocks();
  }
}, [user]);
  return (
    <StockContext.Provider value={{ stocks, increaseStock, fetchStocks }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => useContext(StockContext);
