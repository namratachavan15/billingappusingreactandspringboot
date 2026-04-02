import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock } from "react-icons/fa";
import { useMasterCategoryContext } from "../States/MasterCategoryContext";
import "./MasterCategory.css";

/* ===== Initial Form State ===== */
const initialState = {
  name: "",
  description: "",
};

const AddMasterCategory = () => {
  const {
    categories,
    loading,
    getAllCategories,
    searchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useMasterCategoryContext();

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(categories.length / pageSize);
  const paginatedData = categories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Initial Load ===== */
  useEffect(() => {
    getAllCategories();
  }, []);

  /* ===== Live Search ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchCategories(search);
      } else {
        getAllCategories();
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
      if (editId) {
        await updateCategory(editId, formData);
      } else {
        await addCategory(formData);
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
      description: category.description || "",
    });
    setEditId(category.MACID);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
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
    <div className="master-category-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Master Category Management</h1>
        <p>Add, edit, or manage your product master categories</p>
      </div>

      <div className="category-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Category
                </>
              ) : (
                <>
                  <FaPlus /> Add New Category
                </>
              )}
            </h3>
          </div>
          
          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Category Name <span>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description (optional)"
                  rows="4"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
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
                
                {editId && (
                  <button
                    type="button"
                   
                    onClick={resetForm}
                    disabled={isSubmitting}
                    style={{backgroundColor:'#1a1f36'}}
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
              <FaEdit /> Category List ({categories.length} total)
            </h3>
            
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search categories by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="search-hint">Type to search instantly</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr className="loading-row">
                    <td colSpan="5">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaClock className="fa-spin" /> Loading categories...
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No categories found{search && ` for "${search}"`}</p>
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
                    <tr key={category.MACID}>
                      <td>
                        <span className="id-badge">#{category.MACID}</span>
                      </td>
                      <td>
                        <strong>{category.name}</strong>
                      </td>
                      <td>
                        <span className="description">
                          {category.description || "No description"}
                        </span>
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
                            title="Edit Category"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(category.MACID)}
                            title="Delete Category"
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
          {categories.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, categories.length)} of{" "}
                {categories.length} categories
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

export default AddMasterCategory;