// States/SizeContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../Config/api";

const SizeContext = createContext();
export const useSizeContext = () => useContext(SizeContext);

export const SizeProvider = ({ children }) => {
  const [sizes, setSizes] = useState([]);
  const [unitSizes, setUnitSizes] = useState({}); // cache sizes by unitId

  const fetchSizesByUnit = async (unitId) => {
    if (unitSizes[unitId]) return unitSizes[unitId]; // return cached sizes

    const res = await api.get(`/api/sizes/unit/${unitId}`);
    setUnitSizes((prev) => ({ ...prev, [unitId]: res.data }));
    return res.data;
  };

  const fetchAllSizes = async () => {
    const res = await api.get("/api/sizes");
    setSizes(res.data);
  };

  useEffect(() => {
    fetchAllSizes();
  }, []);

  return (
    <SizeContext.Provider value={{ sizes, fetchSizesByUnit }}>
      {children}
    </SizeContext.Provider>
  );
};
