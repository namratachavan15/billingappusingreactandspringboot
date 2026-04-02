import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";

const SupplierContext = createContext();
export const useSupplierContext = () => useContext(SupplierContext);

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    const res = await api.get("/api/suppliers");
    setSuppliers(res.data);
    setLoading(false);
  };

  const searchSuppliers = async (key) => {
    const res = await api.get(`/api/suppliers/search?key=${key}`);
    setSuppliers(res.data);
  };

  const addSupplier = async (data) => {
    await api.post("/api/suppliers", data);
    fetchSuppliers();
  };

  const updateSupplier = async (id, data) => {
    await api.put(`/api/suppliers/${id}`, data);
    fetchSuppliers();
  };

  const deleteSupplier = async (id) => {
    await api.delete(`/api/suppliers/${id}`);
    fetchSuppliers();
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers,
        loading,
        fetchSuppliers,
        searchSuppliers,
        addSupplier,
        updateSupplier,
        deleteSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};
