import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../Config/api";

const UnitMasterContext = createContext();
export const useUnitMasterContext = () => useContext(UnitMasterContext);

export const UnitMasterProvider = ({ children }) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnits = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/units");
      setUnits(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load
  useEffect(() => {
    fetchUnits();
  }, []);

  return (
    <UnitMasterContext.Provider value={{ units, loading, fetchUnits }}>
      {children}
    </UnitMasterContext.Provider>
  );
};
