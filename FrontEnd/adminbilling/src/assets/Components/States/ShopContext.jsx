import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../Config/api";


const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShops = async (search = "") => {
    setLoading(true);
    try {
      const url = search ? `/api/shops?search=${search}` : "/api/shops";
      const { data } = await api.get(url);
      setShops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addShop = async (shop) => {
    try {
      const { data } = await api.post("/api/shops", shop);
      setShops((prev) => [...prev, data]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateShop = async (id, shop) => {
    try {
      const { data } = await api.put(`/api/shops/${id}`, shop);
      setShops((prev) => prev.map((s) => (s.shopId === id ? data : s)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteShop = async (id) => {
    try {
      await api.delete(`/api/shops/${id}`);
      setShops((prev) => prev.filter((s) => s.shopId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ShopContext.Provider
      value={{ shops, loading, fetchShops, addShop, updateShop, deleteShop }}
    >
      {children}
    </ShopContext.Provider>
  );
};
