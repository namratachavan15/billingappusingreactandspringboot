import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock, FaTruck, FaSpinner, FaBuilding } from "react-icons/fa";
import { useSupplierContext } from "../States/SupplierContext";
import "./Supplier.css";

const initialState = {
  supName: "",
  mob: "",
  gstNo: "",
  address: "",
};

const AddSupplier = () => {
  const {
    suppliers,
    loading,
    fetchSuppliers,
    searchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSupplierContext();

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(suppliers.length / pageSize);
  const paginatedSuppliers = suppliers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Fetch ===== */
  useEffect(() => {
    fetchSuppliers();
  }, []);

  /* ===== Live search with debounce ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchSuppliers(search);
      } else {
        fetchSuppliers();
      }
      setPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* ===== Handle Change ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  /* ===== Validation ===== */
  const validate = () => {
    const errors = {};
    if (!formData.supName.trim()) errors.supName = "Supplier name is required";
    if (!formData.mob.trim()) errors.mob = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mob)) errors.mob = "Mobile must be 10 digits";
    if (!formData.gstNo.trim()) errors.gstNo = "GST Number is required";
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNo.toUpperCase())) {
      errors.gstNo = "Invalid GST Number format";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    return errors;
  };

  /* ===== Submit ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (editId) {
        await updateSupplier(editId, formData);
      } else {
        await addSupplier(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== Edit ===== */
  const handleEdit = (sup) => {
    setFormData({
      supName: sup.supName || "",
      mob: sup.mob || "",
      gstNo: sup.gstNo || "",
      address: sup.address || "",
    });
    setEditId(sup.supId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== Delete ===== */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      await deleteSupplier(id);
    }
  };

  /* ===== Reset ===== */
  const resetForm = () => {
    setFormData(initialState);
    setEditId(null);
    setFormErrors({});
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format GST number with spacing for better readability
  const formatGST = (gstNo) => {
    if (!gstNo) return "";
    const gst = gstNo.toUpperCase();
    return `${gst.slice(0, 2)}${gst.slice(2, 7)}${gst.slice(7, 11)}${gst.slice(11, 13)}${gst.slice(13, 15)}`;
  };

  return (
    <div className="supplier-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Supplier Management</h1>
        <p>Add, edit, or manage your suppliers</p>
      </div>

      <div className="supplier-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Supplier
                </>
              ) : (
                <>
                  <FaTruck /> Supplier Registration
                </>
              )}
            </h3>
          </div>

          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              {/* First Row: Name, Mobile, GST */}
              <div className="form-row-3">
                {/* Supplier Name */}
                <div className="form-group">
                  <label className="form-label">
                    Supplier Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.supName ? 'is-invalid' : ''}`}
                    name="supName"
                    value={formData.supName}
                    onChange={handleChange}
                    placeholder="Enter supplier name"
                    disabled={isSubmitting}
                  />
                  {formErrors.supName && <div className="invalid-feedback">{formErrors.supName}</div>}
                </div>

                {/* Mobile */}
                <div className="form-group">
                  <label className="form-label">
                    Mobile <span>*</span>
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${formErrors.mob ? 'is-invalid' : ''}`}
                    name="mob"
                    value={formData.mob}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile"
                    maxLength="10"
                    disabled={isSubmitting}
                  />
                  {formErrors.mob && <div className="invalid-feedback">{formErrors.mob}</div>}
                </div>

                {/* GST Number */}
                <div className="form-group">
                  <label className="form-label">
                    GST Number <span>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.gstNo ? 'is-invalid' : ''}`}
                    name="gstNo"
                    value={formData.gstNo}
                    onChange={handleChange}
                    placeholder="Enter GST number (15 characters)"
                    maxLength="15"
                    disabled={isSubmitting}
                    style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}
                  />
                  {formErrors.gstNo && <div className="invalid-feedback">{formErrors.gstNo}</div>}
                  <small className="text-muted" style={{ display: 'block', marginTop: '4px', fontSize: '11px' }}>
                    Format: 22ABCDE1234F1Z5
                  </small>
                </div>
              </div>

              {/* Second Row: Address (full width) */}
              <div className="form-group">
                <label className="form-label">
                  Address <span>*</span>
                </label>
                <textarea
                  className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete supplier address"
                  rows="3"
                  disabled={isSubmitting}
                />
                {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
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
                      <FaCheck /> Update Supplier
                    </>
                  ) : (
                    <>
                      <FaPlus /> Register Supplier
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
              <FaBuilding /> Supplier List ({suppliers.length} total)
            </h3>

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, mobile or GST..."
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
                  <th>Supplier Name</th>
                  <th>Mobile</th>
                  <th>GST Number</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr className="loading-row">
                    <td colSpan="6">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSpinner className="fa-spin" /> Loading suppliers...
                      </div>
                    </td>
                  </tr>
                ) : paginatedSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No suppliers found{search && ` for "${search}"`}</p>
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
                  paginatedSuppliers.map((sup) => (
                    <tr key={sup.supId}>
                      <td>
                        <span className="id-badge">#{sup.supId}</span>
                      </td>
                      <td>
                        <strong>{sup.supName}</strong>
                      </td>
                      <td>
                        <span style={{ 
                          fontFamily: 'monospace',
                          fontWeight: '500' 
                        }}>
                          {sup.mob}
                        </span>
                      </td>
                      <td>
                        <span className="gst-badge" title={sup.gstNo}>
                          {formatGST(sup.gstNo)}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          color: 'var(--text-secondary)', 
                          fontSize: '13px',
                          display: '-webkit-box',
                          WebkitLineClamp: '2',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px'
                        }}>
                          {sup.address}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => handleEdit(sup)}
                            title="Edit Supplier"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(sup.supId)}
                            title="Delete Supplier"
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
          {suppliers.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, suppliers.length)} of{" "}
                {suppliers.length} suppliers
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

export default AddSupplier;