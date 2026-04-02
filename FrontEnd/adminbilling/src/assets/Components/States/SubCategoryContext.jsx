import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";

const SubCategoryContext = createContext();
export const useSubCategoryContext = () => useContext(SubCategoryContext);

export const SubCategoryProvider = ({ children }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllSubCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/sub-categories");
      setSubCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const searchSubCategories = async (keyword) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/sub-categories/search?keyword=${keyword}`);
      setSubCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addSubCategory = async (subCategory) => {
    await api.post("/api/sub-categories", subCategory);
    getAllSubCategories();
  };

  const updateSubCategory = async (id, subCategory) => {
    await api.put(`/api/sub-categories/${id}`, subCategory);
    getAllSubCategories();
  };

  const deleteSubCategory = async (id) => {
    await api.delete(`/api/sub-categories/${id}`);
    getAllSubCategories();
  };

  return (
    <SubCategoryContext.Provider
      value={{
        subCategories,
        loading,
        getAllSubCategories,
        searchSubCategories,
        addSubCategory,
        updateSubCategory,
        deleteSubCategory,
      }}
    >
      {children}
    </SubCategoryContext.Provider>
  );
};
