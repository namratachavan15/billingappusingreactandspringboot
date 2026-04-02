// AddSubCategory.jsx - Updated with same theme
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock, FaLayerGroup, FaSpinner, FaSitemap } from "react-icons/fa";
import { useSubCategoryContext } from "../States/SubCategoryContext";
import { useMainCategoryContext } from "../States/MainCategoryContext";
import "./SubCategory.css";

const initialState = {
  name: "",
  mainCategory: "",
};

const AddSubCategory = () => {
  const {
    subCategories,
    loading,
    getAllSubCategories,
    searchSubCategories,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
  } = useSubCategoryContext();

  const { categories: mainCategories, loading: mainLoading, getAllMainCategories } = useMainCategoryContext();

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(subCategories.length / pageSize);
  const paginatedData = subCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Initial Load ===== */
  useEffect(() => {
    getAllSubCategories();
    getAllMainCategories();
  }, []);

  /* ===== Live Search ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchSubCategories(search);
      } else {
        getAllSubCategories();
      }
      setPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* ===== Handlers ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Find the selected main category
      const selectedMainCat = mainCategories.find((m) => m.MCID === parseInt(formData.mainCategory));
      
      const payload = {
        name: formData.name,
        mainCategory: selectedMainCat || null
      };
      
      if (editId) {
        await updateSubCategory(editId, payload);
      } else {
        await addSubCategory(payload);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      mainCategory: category.mainCategory?.MCID?.toString() || "",
    });
    setEditId(category.SCId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub-category?")) {
      await deleteSubCategory(id);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setEditId(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="sub-category-container">
      {/* Loading Overlay */}
      {mainLoading && (
        <div className="loading-overlay">
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            backgroundColor: 'white',
            padding: '20px 30px',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <FaSpinner className="fa-spin" style={{ fontSize: "20px", color: "var(--primary)" }} />
            <span style={{ fontSize: "16px", color: "var(--text-primary)", fontWeight: "500" }}>
              Loading main categories...
            </span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <h1>Sub-Category Management</h1>
        <p>Add, edit, or manage your product sub-categories</p>
      </div>

      <div className="category-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Sub-Category
                </>
              ) : (
                <>
                  <FaPlus /> Add New Sub-Category
                </>
              )}
            </h3>
          </div>
          
          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Select Main Category <span>*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    className="form-select"
                    name="mainCategory"
                    value={formData.mainCategory}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting || mainLoading}
                  >
                    <option value="">Choose a main category</option>
                    {mainCategories
                      .filter(mc => mc.status) // Show only active main categories
                      .map((mc) => (
                        <option key={mc.MCID} value={mc.MCID}>
                          {mc.name}
                        </option>
                      ))}
                  </select>
                </div>
                {mainCategories.length === 0 && !mainLoading && (
                  <small className="text-danger" style={{ display: "block", marginTop: "8px" }}>
                    No main categories available. Please add main categories first.
                  </small>
                )}
                {mainLoading && (
                  <small className="text-muted" style={{ display: "block", marginTop: "8px" }}>
                    <FaSpinner className="fa-spin" /> Loading main categories...
                  </small>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Sub-Category Name <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter sub-category name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || mainCategories.length === 0 || mainLoading}
                >
                  {isSubmitting ? (
                    <>
                      <FaClock /> Processing...
                    </>
                  ) : editId ? (
                    <>
                      <FaCheck /> Update Category
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Category
                    </>
                  )}
                </button>
                
                {(editId || isSubmitting) && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ================= TABLE CARD ================= */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <FaSitemap /> Sub-Category List ({subCategories.length} total)
            </h3>
            
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search sub-categories by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={loading}
              />
              <span className="search-hint">Type to search instantly</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sub-Category Name</th>
                  <th>Main Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr className="loading-row">
                    <td colSpan="5">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSpinner className="fa-spin" /> Loading sub-categories...
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No sub-categories found{search && ` for "${search}"`}</p>
                        {search && (
                          <button
                            className="btn btn-outline"
                            onClick={() => setSearch("")}
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((category) => (
                    <tr key={category.SCId}>
                      <td>
                        <span className="id-badge">#{category.SCId}</span>
                      </td>
                      <td>
                        <strong>{category.name}</strong>
                      </td>
                      <td>
                        {category.mainCategory ? (
                          <span className="main-category-badge">
                            <FaLayerGroup /> {category.mainCategory.name}
                          </span>
                        ) : (
                          <span className="text-muted">Not assigned</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${category.status ? 'status-active' : 'status-inactive'}`}>
                          {category.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => handleEdit(category)}
                            title="Edit Sub-Category"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(category.SCId)}
                            title="Delete Sub-Category"
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          {subCategories.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, subCategories.length)} of{" "}
                {subCategories.length} categories
              </div>
              
              <div className="pagination-controls">
                <button
                  className="page-btn page-nav"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = index + 1;
                  } else if (page <= 3) {
                    pageNumber = index + 1;
                  } else if (page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + index;
                  } else {
                    pageNumber = page - 2 + index;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      className={`page-btn ${page === pageNumber ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={loading}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  className="page-btn page-nav"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || loading}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSubCategory;