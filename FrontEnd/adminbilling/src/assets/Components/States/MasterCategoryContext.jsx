import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const MasterCategoryContext = createContext();
export const useMasterCategoryContext = () =>
  useContext(MasterCategoryContext);

export const MasterCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= GET ALL ================= */
  const getAllCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/master-categories");
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */
  const searchCategories = async (keyword) => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/api/master-categories/search?keyword=${keyword}`
      );
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ================= CRUD ================= */
  const addCategory = async (category) => {
    await api.post("/api/master-categories", category);
    getAllCategories();
  };

  const updateCategory = async (id, category) => {
    await api.put(`/api/master-categories/${id}`, category);
    getAllCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/api/master-categories/${id}`);
    getAllCategories();
  };

  return (
    <MasterCategoryContext.Provider
      value={{
        categories,
        loading,
        getAllCategories,
        searchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </MasterCategoryContext.Provider>
  );
};
