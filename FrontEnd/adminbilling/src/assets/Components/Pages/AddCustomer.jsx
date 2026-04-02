import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock, FaUser, FaSpinner, FaUsers } from "react-icons/fa";
import { useCustomerContext } from "../States/CustomerContext";
import "./Customer.css";

const initialState = {
  name: "",
  mobile: "",
  email: "",
  address: "",
};

const AddCustomer = () => {
  const {
    customers,
    loading,
    fetchCustomers,
    searchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomerContext();

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(customers.length / pageSize);
  const paginatedCustomers = customers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Fetch ===== */
  useEffect(() => {
    fetchCustomers();
  }, []);

  /* ===== Search (Debounce) ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchCustomers(search);
      } else {
        fetchCustomers();
      }
      setPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* ===== Handle Change ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  /* ===== Validation ===== */
  const validate = () => {
    const err = {};
    
    if (!formData.name.trim()) err.name = "Name is required";
    if (!formData.mobile.trim()) err.mobile = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobile)) err.mobile = "Mobile must be 10 digits";
    if (!formData.email.trim()) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = "Email is invalid";
    if (!formData.address.trim()) err.address = "Address is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ===== Submit ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (editId) {
        await updateCustomer(editId, formData);
      } else {
        await addCustomer(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== Edit ===== */
  const handleEdit = (cust) => {
    setFormData({
      name: cust.name || "",
      mobile: cust.mobile || "",
      email: cust.email || "",
      address: cust.address || "",
    });
    setEditId(cust.custId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== Delete ===== */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomer(id);
    }
  };

  /* ===== Reset ===== */
  const resetForm = () => {
    setFormData(initialState);
    setEditId(null);
    setErrors({});
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="customer-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Customer Management</h1>
        <p>Add, edit, or manage your customers</p>
      </div>

      <div className="customer-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Customer
                </>
              ) : (
                <>
                  <FaUser /> Add New Customer
                </>
              )}
            </h3>
          </div>

          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              {/* First Row: Name, Mobile */}
              <div className="form-row-2">
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    disabled={isSubmitting}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                {/* Mobile */}
                <div className="form-group">
                  <label className="form-label">
                    Mobile <span>*</span>
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                    disabled={isSubmitting}
                  />
                  {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
                </div>
              </div>

              {/* Second Row: Email, Address */}
              <div className="form-row-2">
                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Address */}
                <div className="form-group">
                  <label className="form-label">
                    Address <span>*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows="3"
                    disabled={isSubmitting}
                  />
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
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
                      <FaCheck /> Update Customer
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Customer
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
              <FaUsers /> Customer List ({customers.length} total)
            </h3>

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, mobile or email..."
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
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr className="loading-row">
                    <td colSpan="6">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSpinner className="fa-spin" /> Loading customers...
                      </div>
                    </td>
                  </tr>
                ) : paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No customers found{search && ` for "${search}"`}</p>
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
                  paginatedCustomers.map((cust) => (
                    <tr key={cust.custId}>
                      <td>
                        <span className="id-badge">#{cust.custId}</span>
                      </td>
                      <td>
                        <strong>{cust.name}</strong>
                      </td>
                      <td>
                        <span style={{ 
                          fontFamily: 'monospace',
                          fontWeight: '500' 
                        }}>
                          {cust.mobile}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          color: 'var(--text-muted)', 
                          fontSize: '13px',
                          wordBreak: 'break-all' 
                        }}>
                          {cust.email}
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
                          {cust.address}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => handleEdit(cust)}
                            title="Edit Customer"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(cust.custId)}
                            title="Delete Customer"
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
          {customers.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, customers.length)} of{" "}
                {customers.length} customers
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

export default AddCustomer;