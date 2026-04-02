import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";

const DiscountContext = createContext();

export const DiscountProvider = ({ children }) => {
  const [discountList, setDiscountList] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const res = await api.get("/discounts"); // backend endpoint
      setDiscountList(res.data);
    } catch (err) {
      console.error("Failed to fetch discounts", err);
    }
  };

  return (
    <DiscountContext.Provider value={{ discountList, fetchDiscounts }}>
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscountContext = () => useContext(DiscountContext);
