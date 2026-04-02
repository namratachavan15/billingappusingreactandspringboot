import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";
import { useStock } from "./StockContext";

const SaleContext = createContext();

export const SaleProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchStocks } = useStock(); // make sure fetchStocks exists
  const normalizeSales = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  };
  
  const fetchSales = async () => {
    setLoading(true);
    const res = await api.get("/api/sales");
    console.log("FETCH SALES RESPONSE 👉", res.data);
    setSales(normalizeSales(res.data));
    setLoading(false);
  };
  
  const searchSales = async (key) => {
    const res = await api.get(`/api/sales/search?key=${key}`);
    setSales(normalizeSales(res.data));
  };
  

  const addSale = async (data) => {
    const res = await api.post("/api/sales", data); // 🔥 STORE RESPONSE
    fetchSales();
    fetchStocks();
    return res.data; // ✅ NOW VALID
  };
  
  const updateSale = async (id, data) => {
    const res = await api.put(`/api/sales/${id}`, data); // 🔥 STORE RESPONSE
    fetchSales();
    fetchStocks();
    return res.data; // ✅ NOW VALID
  };
  

  const deleteSale = async (id) => {
    await api.delete(`/api/sales/${id}`);
    fetchSales();
  };

  const getSaleById = async (id) => {
    const res = await api.get(`/api/sales/${id}`);
    return res.data;
  };



  return (
    <SaleContext.Provider value={{ sales, loading, fetchSales, addSale, updateSale, deleteSale, getSaleById, searchSales }}>
      {children}
    </SaleContext.Provider>
  );
};

export const useSaleContext = () => useContext(SaleContext);
