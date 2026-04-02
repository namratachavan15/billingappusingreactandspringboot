import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const EmployeeContext = createContext();
export const useEmployeeContext = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await api.get("/api/employees");
    setEmployees(res.data);
    setLoading(false);
  };

  const searchEmployees = async (key) => {
    const res = await api.get(`/api/employees/search?key=${key}`);
    setEmployees(res.data);
  };

  const addEmployee = async (data) => {
    await api.post("/api/employees", data);
    fetchEmployees();
  };

  const updateEmployee = async (id, data) => {
    await api.put(`/api/employees/${id}`, data);
    fetchEmployees();
  };

  const deleteEmployee = async (id) => {
    await api.delete(`/api/employees/${id}`);
    fetchEmployees();
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        loading,
        fetchEmployees,
        searchEmployees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
