import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../Config/api";

const GstMasterContext = createContext();
export const useGstMasterContext = () => useContext(GstMasterContext);

export const GstMasterProvider = ({ children }) => {
  const [gstList, setGstList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchGstList = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/gst");
      setGstList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load
  useEffect(() => {
    fetchGstList();
  }, []);

  return (
    <GstMasterContext.Provider value={{ gstList, loading, fetchGstList }}>
      {children}
    </GstMasterContext.Provider>
  );
};
