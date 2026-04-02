import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaStore,
} from "react-icons/fa";
import { useAuth } from "../States/AuthContext";
import "./Shop.css";

import { useNavigate } from "react-router-dom";


/* ===== Initial States ===== */
const adminInitial = {
  shopName: "",
  ownerName: "",
  mobile: "",
  email: "",
  password: "",
};

const ownerInitial = {
  gstNo: "",
  address: "",
  bankName: "",
  bankAc: "",
  ifsc: "",
  branch: "",
  branchName: "",
};

const AddShop = () => {
   const navigate = useNavigate();
  const { user, token } = useAuth();
  const isAdmin = user.role === "ADMIN";
  const isOwner = user.role === "OWNER";

  const [adminForm, setAdminForm] = useState(adminInitial);
  const [ownerForm, setOwnerForm] = useState(ownerInitial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
 


  /* ================= LOAD OWNER SHOP ================= */
  useEffect(() => {
    if (isOwner && user.shopId) {
      setLoading(true);
      fetch(`http://localhost:5454/api/shops/${user.shopId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setOwnerForm({
            gstNo: data.gstNo || "",
            address: data.address || "",
            bankName: data.bankName || "",
            bankAc: data.bankAc || "",
            ifsc: data.ifsc || "",
            branch: data.branch || "",
            branchName: data.branchName || "",
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [isOwner, user.shopId, token]);

  /* ================= VALIDATION ================= */
  const validateAdmin = () => {
    const e = {};
    if (!adminForm.shopName) e.shopName = "Shop Name is required";
    if (!adminForm.ownerName) e.ownerName = "Owner Name is required";
    if (!adminForm.mobile) e.mobile = "Mobile is required";
    if (!adminForm.email) e.email = "Email is required";
    if (!adminForm.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateOwner = () => {
    const e = {};
    if (!ownerForm.gstNo) e.gstNo = "GST No is required";
    if (!ownerForm.address) e.address = "Address is required";
    if (!ownerForm.bankName) e.bankName = "Bank Name is required";
    if (!ownerForm.bankAc) e.bankAc = "Bank Account is required";
    if (!ownerForm.ifsc) e.ifsc = "IFSC is required";
    if (!ownerForm.branch) e.branch = "Branch is required";
    if (!ownerForm.branchName) e.branchName = "Branch Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      setLoading(true);

      if (isAdmin) {
        if (!validateAdmin()) return;

        await fetch("http://localhost:5454/api/auth/admin/create-shop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...adminForm,
          }),
        });

        setSuccess("Shop & Owner created successfully");
        setAdminForm(adminInitial);

        // ✅ REDIRECT TO ADMIN DASHBOARD
  setTimeout(() => {
    navigate("/");
  }, 800);
      }

      if (isOwner) {
        if (!validateOwner()) return;

        await fetch(
          `http://localhost:5454/api/auth/owner/complete-shop/${user.shopId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ownerForm),
          }
        );

        setSuccess("Shop profile completed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
  const handleReset = () => {
    setAdminForm(adminInitial);
    setOwnerForm(ownerInitial);
    setErrors({});
    setSuccess("");
    setError("");
  };

  /* ================= UI ================= */
  return (
    <div className={`shop-container ${isAdmin ? "admin-view" : ""}`}>

      <div className="page-header">
        <h1>{isAdmin ? "Create Shop" : "Complete Shop Profile"}</h1>
        <p>Manage shop details and ownership information</p>
      </div>

      {success && (
        <div className="alert-success">
          <FaCheck /> {success}
        </div>
      )}
      {error && (
        <div className="alert-error">
          <FaTimes /> {error}
        </div>
      )}

      <div className="shop-form-card">
        <div className="shop-form-header">
          <h3>
            <FaStore /> {isAdmin ? "New Shop Information" : "Owner Shop Details"}
          </h3>
        </div>

        <form className="shop-form-body" onSubmit={handleSubmit}>
          <div className="form-grid-2">
            {/* ===== ADMIN FIELDS ===== */}
            {isAdmin && (
              <>
                <div className="form-group">
                  <label>
                    Shop Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={adminForm.shopName}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, shopName: e.target.value })
                    }
                    className={`form-control ${
                      errors.shopName ? "is-invalid" : ""
                    }`}
                    placeholder="Enter shop name"
                  />
                  <div className="invalid-feedback">{errors.shopName}</div>
                </div>

                <div className="form-group">
                  <label>
                    Owner Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={adminForm.ownerName}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, ownerName: e.target.value })
                    }
                    className={`form-control ${
                      errors.ownerName ? "is-invalid" : ""
                    }`}
                    placeholder="Enter owner name"
                  />
                  <div className="invalid-feedback">{errors.ownerName}</div>
                </div>

                <div className="form-group">
                  <label>
                    Mobile <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={adminForm.mobile}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, mobile: e.target.value })
                    }
                    className={`form-control ${
                      errors.mobile ? "is-invalid" : ""
                    }`}
                    placeholder="Enter mobile number"
                  />
                  <div className="invalid-feedback">{errors.mobile}</div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={adminForm.email}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, email: e.target.value })
                    }
                    className="form-control"
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, password: e.target.value })
                    }
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    placeholder="Enter password"
                  />
                  <div className="invalid-feedback">{errors.password}</div>
                </div>
              </>
            )}

            {/* ===== OWNER FIELDS ===== */}
            {isOwner && (
              <>
                <div className="form-group">
                  <label>GST No</label>
                  <input
                    type="text"
                    value={ownerForm.gstNo}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, gstNo: e.target.value })
                    }
                    className={`form-control ${errors.gstNo ? "is-invalid" : ""}`}
                    placeholder="Enter GST number"
                  />
                  <div className="invalid-feedback">{errors.gstNo}</div>
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={ownerForm.address}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, address: e.target.value })
                    }
                    className={`form-textarea ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    placeholder="Enter address"
                  />
                  <div className="invalid-feedback">{errors.address}</div>
                </div>

                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    value={ownerForm.bankName}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, bankName: e.target.value })
                    }
                    className={`form-control ${errors.bankName ? "is-invalid" : ""}`}
                    placeholder="Enter bank name"
                  />
                  <div className="invalid-feedback">{errors.bankName}</div>
                </div>

                <div className="form-group">
                  <label>Bank Account</label>
                  <input
                    type="text"
                    value={ownerForm.bankAc}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, bankAc: e.target.value })
                    }
                    className={`form-control ${errors.bankAc ? "is-invalid" : ""}`}
                    placeholder="Enter account number"
                  />
                  <div className="invalid-feedback">{errors.bankAc}</div>
                </div>

                <div className="form-group">
                  <label>IFSC</label>
                  <input
                    type="text"
                    value={ownerForm.ifsc}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, ifsc: e.target.value })
                    }
                    className={`form-control ${errors.ifsc ? "is-invalid" : ""}`}
                    placeholder="Enter IFSC code"
                  />
                  <div className="invalid-feedback">{errors.ifsc}</div>
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    value={ownerForm.branch}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, branch: e.target.value })
                    }
                    className={`form-control ${errors.branch ? "is-invalid" : ""}`}
                    placeholder="Enter branch"
                  />
                  <div className="invalid-feedback">{errors.branch}</div>
                </div>

                <div className="form-group">
                  <label>Branch Name</label>
                  <input
                    type="text"
                    value={ownerForm.branchName}
                    onChange={(e) =>
                      setOwnerForm({ ...ownerForm, branchName: e.target.value })
                    }
                    className={`form-control ${errors.branchName ? "is-invalid" : ""}`}
                    placeholder="Enter branch name"
                  />
                  <div className="invalid-feedback">{errors.branchName}</div>
                </div>
              </>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {loading ? (
                <FaSpinner className="spin" />
              ) : isAdmin ? (
                <>
                  <FaPlus /> Create Shop
                </>
              ) : (
                <>
                  <FaEdit /> Complete Profile
                </>
              )}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
            >
              <FaTimes /> Clear
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading-overlay">
            <FaSpinner className="spin" size={30} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AddShop;
