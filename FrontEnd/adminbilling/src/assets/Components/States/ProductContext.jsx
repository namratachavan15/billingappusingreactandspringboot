import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";


const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  /* Fetch all */
  const fetchProducts = async () => {
    const res = await api.get("/api/products");
    setProducts(res.data);
  };

  /* Search */
  const searchProducts = async (q) => {
    const res = await api.get(`/api/products/search?q=${q}`);
    setProducts(res.data);
  };

/* Add */
const addProduct = async (data) => {
    await api.post("/api/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    fetchProducts();
  };
  
  /* Update */
  const updateProduct = async (id, data) => {
    await api.put(`/api/products/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    fetchProducts();
  };
  

  /* Delete */
  const deleteProduct = async (id) => {
    await api.delete(`/api/products/${id}`);
    fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        fetchProducts,
        searchProducts,
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
