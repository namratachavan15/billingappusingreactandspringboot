import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";

const PurchaseContext = createContext();
export const usePurchaseContext = () => useContext(PurchaseContext);

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Fetch all */
  const fetchPurchases = async () => {
    setLoading(true);
    const res = await api.get("/api/purchases");
    setPurchases(res.data);
    setLoading(false);
  };

  /* Search */
  const searchPurchases = async (key) => {
    setLoading(true);
    try {
      if (!key || key.trim() === "") {
        const res = await api.get("/api/purchases");
        setPurchases(res.data);
      } else {
        const res = await api.get(
          `/api/purchases/search?key=${encodeURIComponent(key)}`
        );
        setPurchases(res.data);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setLoading(false);
    }
  };
  

  /* Add */
  const addPurchase = async (data) => {
    await api.post("/api/purchases", data);
    fetchPurchases();
  };

  /* Update */
  const updatePurchase = async (id, data) => {
    await api.put(`/api/purchases/${id}`, data);
    fetchPurchases();
  };

  /* Delete */
  const deletePurchase = async (id) => {
    await api.delete(`/api/purchases/${id}`);
    fetchPurchases();
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        loading,
        fetchPurchases,
        searchPurchases,
        addPurchase,
        updatePurchase,
        deletePurchase,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
