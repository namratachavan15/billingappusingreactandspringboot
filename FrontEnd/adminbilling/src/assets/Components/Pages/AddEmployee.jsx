import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock, FaUserPlus, FaSpinner, FaIdBadge } from "react-icons/fa";
import { useEmployeeContext } from "../States/EmployeeContext";
import "./Employee.css";

const initialState = {
  name: "",
  role: "",
  mob: "",
  email: "",
  salary: "",
  joinDate: "",
  shift: "",
};

const AddEmployee = () => {
  const {
    employees,
    loading,
    fetchEmployees,
    searchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployeeContext();

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(employees.length / pageSize);
  const paginatedEmployees = employees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Fetch Employees on Load ===== */
  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ===== Live Search with Debounce ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchEmployees(search);
      } else {
        fetchEmployees();
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
    if (!formData.name.trim()) errors.name = "Employee name is required";
    if (!formData.role.trim()) errors.role = "Role is required";
    if (!formData.mob.trim()) errors.mob = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mob)) errors.mob = "Mobile must be 10 digits";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.salary) errors.salary = "Salary is required";
    else if (parseFloat(formData.salary) <= 0) errors.salary = "Salary must be greater than 0";
    if (!formData.joinDate) errors.joinDate = "Join date is required";
    if (!formData.shift) errors.shift = "Shift is required";
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
        await updateEmployee(editId, formData);
      } else {
        await addEmployee(formData);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== Edit ===== */
  const handleEdit = (emp) => {
    setFormData({
      name: emp.name || "",
      role: emp.role || "",
      mob: emp.mob || "",
      email: emp.email || "",
      salary: emp.salary || "",
      joinDate: emp.joinDate || "",
      shift: emp.shift || "",
    });
    setEditId(emp.empId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== Delete ===== */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="employee-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Employee Management</h1>
        <p>Add, edit, or manage your employees</p>
      </div>

      <div className="employee-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Employee
                </>
              ) : (
                <>
                  <FaUserPlus /> Employee Registration
                </>
              )}
            </h3>
          </div>

          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              {/* First Row: Name, Role, Mobile */}
              <div className="form-row-3">
                {/* Name */}
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter employee name"
                    disabled={isSubmitting}
                  />
                  {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                </div>

                {/* Role */}
                <div className="form-group">
                  <label className="form-label">
                    Role <span>*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.role ? 'is-invalid' : ''}`}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Enter employee role"
                    disabled={isSubmitting}
                  />
                  {formErrors.role && <div className="invalid-feedback">{formErrors.role}</div>}
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
              </div>

              {/* Second Row: Email, Salary, Join Date */}
              <div className="form-row-3">
                {/* Email */}
                <div className="form-group">
                  <label className="form-label">
                    Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                </div>

                {/* Salary */}
                <div className="form-group">
                  <label className="form-label">
                    Salary <span>*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.salary ? 'is-invalid' : ''}`}
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter salary amount"
                    min="0"
                    step="1000"
                    disabled={isSubmitting}
                  />
                  {formErrors.salary && <div className="invalid-feedback">{formErrors.salary}</div>}
                </div>

                {/* Join Date */}
                <div className="form-group">
                  <label className="form-label">
                    Join Date <span>*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${formErrors.joinDate ? 'is-invalid' : ''}`}
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.joinDate && <div className="invalid-feedback">{formErrors.joinDate}</div>}
                </div>
              </div>

              {/* Third Row: Shift (single field) */}
              <div className="form-group shift-field">
                <label className="form-label">
                  Shift <span>*</span>
                </label>
                <div className="select-wrapper">
                  <select
                    className={`form-select ${formErrors.shift ? 'is-invalid' : ''}`}
                    name="shift"
                    value={formData.shift}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select shift</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                {formErrors.shift && <div className="invalid-feedback">{formErrors.shift}</div>}
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
                      <FaCheck /> Update Employee
                    </>
                  ) : (
                    <>
                      <FaUserPlus /> Register Employee
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
              <FaIdBadge /> Employee List ({employees.length} total)
            </h3>

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, role or mobile..."
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
                  <th>Role</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Salary</th>
                  <th>Join Date</th>
                  <th>Shift</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr className="loading-row">
                    <td colSpan="9">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSpinner className="fa-spin" /> Loading employees...
                      </div>
                    </td>
                  </tr>
                ) : paginatedEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No employees found{search && ` for "${search}"`}</p>
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
                  paginatedEmployees.map((emp) => (
                    <tr key={emp.empId}>
                      <td>
                        <span className="id-badge">#{emp.empId}</span>
                      </td>
                      <td>
                        <strong>{emp.name}</strong>
                      </td>
                      <td>
                        <span className="role-badge">
                          {emp.role}
                        </span>
                      </td>
                      <td>{emp.mob}</td>
                      <td>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                          {emp.email}
                        </span>
                      </td>
                      <td>
                        <strong>{formatCurrency(emp.salary)}</strong>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          {formatDate(emp.joinDate)}
                        </span>
                      </td>
                      <td>
                        <span className={`shift-badge shift-${emp.shift?.toLowerCase() || 'morning'}`}>
                          {emp.shift}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => handleEdit(emp)}
                            title="Edit Employee"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(emp.empId)}
                            title="Delete Employee"
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
          {employees.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, employees.length)} of{" "}
                {employees.length} employees
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

export default AddEmployee;