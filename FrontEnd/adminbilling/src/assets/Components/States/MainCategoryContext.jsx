import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";

const MainCategoryContext = createContext();
export const useMainCategoryContext = () => useContext(MainCategoryContext);

export const MainCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllMainCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/main-categories");
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const searchMainCategories = async (keyword) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/main-categories/search?keyword=${keyword}`);
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addMainCategory = async (category) => {
    await api.post("/api/main-categories", category);
    getAllMainCategories();
  };

  const updateMainCategory = async (id, category) => {
    await api.put(`/api/main-categories/${id}`, category);
    getAllMainCategories();
  };

  const deleteMainCategory = async (id) => {
    await api.delete(`/api/main-categories/${id}`);
    getAllMainCategories();
  };

  return (
    <MainCategoryContext.Provider
      value={{
        categories,
        loading,
        getAllMainCategories,
        searchMainCategories,
        addMainCategory,
        updateMainCategory,
        deleteMainCategory,
      }}
    >
      {children}
    </MainCategoryContext.Provider>
  );
};
