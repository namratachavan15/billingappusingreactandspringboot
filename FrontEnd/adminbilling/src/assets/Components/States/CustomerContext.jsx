import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ===== GET ALL ===== */
  const fetchCustomers = async () => {
    setLoading(true);
    const res = await api.get("/api/customers");
    setCustomers(res.data);
    setLoading(false);
  };

  /* ===== ADD ===== */
  const addCustomer = async (data) => {
    await api.post("/api/customers", data);
    fetchCustomers();
  };

  /* ===== UPDATE ===== */
  const updateCustomer = async (id, data) => {
    await api.put(`/api/customers/${id}`, data);
    fetchCustomers();
  };

  /* ===== DELETE ===== */
  const deleteCustomer = async (id) => {
    await api.delete(`/api/customers/${id}`);
    fetchCustomers();
  };

  /* ===== GET BY ID (optional) ===== */
  const getCustomerById = async (id) => {
    const res = await api.get(`/api/customers/${id}`);
    return res.data;
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        fetchCustomers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomerById,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => useContext(CustomerContext);
