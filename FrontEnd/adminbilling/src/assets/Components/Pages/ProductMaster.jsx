import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock, FaBox, FaSpinner, FaImage, FaTag, FaLayerGroup, FaSitemap, FaDollarSign, FaPercentage, FaBalanceScale, FaPercent, FaArchive, FaAlignLeft, FaUpload } from "react-icons/fa";
import { useMasterCategoryContext } from "../States/MasterCategoryContext";
import { useMainCategoryContext } from "../States/MainCategoryContext";
import { useSubCategoryContext } from "../States/SubCategoryContext";
import { useGstMasterContext } from "../States/GstMasterContext";
import { useUnitMasterContext } from "../States/UnitMasterContext";
import { useProductContext } from "../States/ProductContext";
import { useDiscountContext } from "../States/DiscountContext";
import "./Product.css";

const initialState = {
  pName: "",
  masterCategory: null,
  mainCategory: null,
  subCategory: null,
  basePrice: "",
  gst: null,
  priceWithGst: "",
  unit: null,
  description: "",
  rackNumber: "",
  image: null,
  discount: null,
};

const ProductMaster = () => {
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct, searchProducts } = useProductContext();
  const { categories: masterCategories, loading: masterLoading,getAllCategories } = useMasterCategoryContext();
  const { categories: mainCategories, loading: mainLoading,getAllMainCategories } = useMainCategoryContext();
  const { subCategories, loading: subLoading, getAllSubCategories } = useSubCategoryContext();
  const { gstList, loading: gstLoading,fetchGstList } = useGstMasterContext();
  const { units, loading: unitLoading,fetchUnits } = useUnitMasterContext();
  const { discountList, loading: discountLoading,fetchDiscounts } = useDiscountContext();

  const [formData, setFormData] = useState(initialState);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(products.length / pageSize);
  const paginatedProducts = products.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    getAllCategories();
    getAllMainCategories();
    getAllSubCategories();
    fetchGstList();
    fetchUnits();
    fetchProducts();
    fetchDiscounts();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchProducts(search);
      } else {
        fetchProducts();
      }
      setPage(1);
    }, 400);
  
    return () => clearTimeout(delay);
  }, [search]);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSelect = (name, valueObj) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: valueObj };
      
      // Reset dependent categories
      if (name === "masterCategory") {
        updated.mainCategory = null;
        updated.subCategory = null;
      }
      if (name === "mainCategory") {
        updated.subCategory = null;
      }
      
      // Calculate price with GST
      if (name === "gst" || name === "basePrice") {
        const base = parseFloat(updated.basePrice) || 0;
        const gstRate = updated.gst ? parseFloat(updated.gst.gstRate) : 0;
        updated.priceWithGst = (base + (base * gstRate) / 100).toFixed(2);
      }
      
      return updated;
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.pName.trim()) errors.pName = "Product name is required";
    if (!formData.masterCategory) errors.masterCategory = "Select master category";
    if (!formData.mainCategory) errors.mainCategory = "Select main category";
    if (!formData.subCategory) errors.subCategory = "Select sub category";
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) errors.basePrice = "Valid base price is required";
    if (!formData.gst) errors.gst = "Select GST rate";
    if (!formData.unit) errors.unit = "Select unit";
    return errors;
  };

  const mapCategory = (cat, type) => {
    if (!cat) return null;
    if (type === "master") return { macid: cat.MACID };
    if (type === "main") return { mcid: cat.MCID };
    if (type === "sub") return { scid: cat.SCId };
  };

  // Helper function to clean image path
  const cleanImagePath = (imagePath) => {
    if (!imagePath) return null;
    // Remove any leading slashes or backslashes
    return imagePath.replace(/^[\\/]+/, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append(
        "product",
        JSON.stringify({
          pName: formData.pName,
          masterCategory: mapCategory(formData.masterCategory, "master"),
          mainCategory: mapCategory(formData.mainCategory, "main"),
          subCategory: mapCategory(formData.subCategory, "sub"),
          basePrice: formData.basePrice,
          gst: { gstId: formData.gst.gstId },
          unit: { unitId: formData.unit.unitId },
          discount: formData.discount ? { discountId: formData.discount.discountId } : null,
          description: formData.description,
          rackNumber: formData.rackNumber,
          priceWithGst: formData.priceWithGst,
        })
      );

      if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }

      if (editId) {
        await updateProduct(editId, fd);
      } else {
        await addProduct(fd);
      }
      
      resetForm();
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("Error saving product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (prod) => {
    setFormData({
      pName: prod.pName || "",
      masterCategory: prod.masterCategory || null,
      mainCategory: prod.mainCategory || null,
      subCategory: prod.subCategory || null,
      basePrice: prod.basePrice || "",
      gst: prod.gst ? { gstId: prod.gst.gstId, gstRate: prod.gst.gstRate } : null,
      priceWithGst: prod.priceWithGst || "",
      unit: prod.unit || null,
      description: prod.description || "",
      rackNumber: prod.rackNumber || "",
      image: null,
      discount: prod.discount || null,
    });

    // Clean and set preview image
    if (prod.image) {
      const cleanedImagePath = cleanImagePath(prod.image);
      setPreview(`http://localhost:5454/uploads/${cleanedImagePath}`);
    } else {
      setPreview(null);
    }
    
    setEditId(prod.PId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const resetForm = () => {
    setFormData(initialState);
    setEditId(null);
    setFormErrors({});
    setPreview(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredMainCategories = formData.masterCategory
    ? mainCategories.filter((m) => m.masterCategory?.MACID === formData.masterCategory.MACID)
    : [];
  const filteredSubCategories = formData.mainCategory
    ? subCategories.filter((s) => s.mainCategory?.MCID === formData.mainCategory.MCID)
    : [];

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanedPath = cleanImagePath(imagePath);
    return `http://localhost:5454/uploads/${cleanedPath}`;
  };

  return (
    <div className="product-master-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Product Master</h1>
        <p>Add, edit, or manage your products</p>
      </div>

      <div className="product-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Product
                </>
              ) : (
                <>
                  <FaBox /> Add New Product
                </>
              )}
            </h3>
          </div>

          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              {/* Product Details Grid */}
              <div className="form-grid">
                {/* Product Name */}
                <div className="form-group">
                  <label className="form-label">
                    <FaTag /> Product Name <span>*</span>
                  </label>
                  <input
                    className={`form-control ${formErrors.pName ? 'is-invalid' : ''}`}
                    name="pName"
                    value={formData.pName}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    disabled={isSubmitting}
                  />
                  {formErrors.pName && <div className="invalid-feedback">{formErrors.pName}</div>}
                </div>

                {/* Master Category */}
                <div className="form-group">
                  <label className="form-label">
                    <FaLayerGroup /> Master Category <span>*</span>
                  </label>
                  <select
                    className={`form-control ${formErrors.masterCategory ? 'is-invalid' : ''}`}
                    value={formData.masterCategory?.MACID || ""}
                    onChange={(e) =>
                      handleSelect("masterCategory", masterCategories.find((c) => c.MACID === parseInt(e.target.value)))
                    }
                    disabled={isSubmitting || masterLoading}
                  >
                    <option value="">Select Master Category</option>
                    {masterCategories.map((c) => (
                      <option key={c.MACID} value={c.MACID}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.masterCategory && <div className="invalid-feedback">{formErrors.masterCategory}</div>}
                </div>

                {/* Main Category */}
                <div className="form-group">
                  <label className="form-label">
                    <FaLayerGroup /> Main Category <span>*</span>
                  </label>
                  <select
                    className={`form-control ${formErrors.mainCategory ? 'is-invalid' : ''}`}
                    value={formData.mainCategory?.MCID || ""}
                    disabled={!formData.masterCategory || isSubmitting || mainLoading}
                    onChange={(e) => handleSelect("mainCategory", filteredMainCategories.find((c) => c.MCID === parseInt(e.target.value)))}
                  >
                    <option value="">Select Main Category</option>
                    {filteredMainCategories.map((c) => (
                      <option key={c.MCID} value={c.MCID}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.mainCategory && <div className="invalid-feedback">{formErrors.mainCategory}</div>}
                </div>

                {/* Sub Category */}
                <div className="form-group">
                  <label className="form-label">
                    <FaSitemap /> Sub Category <span>*</span>
                  </label>
                  <select
                    className={`form-control ${formErrors.subCategory ? 'is-invalid' : ''}`}
                    value={formData.subCategory?.SCId || ""}
                    disabled={!formData.mainCategory || isSubmitting || subLoading}
                    onChange={(e) => handleSelect("subCategory", filteredSubCategories.find((c) => c.SCId === parseInt(e.target.value)))}
                  >
                    <option value="">Select Sub Category</option>
                    {filteredSubCategories.map((c) => (
                      <option key={c.SCId} value={c.SCId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.subCategory && <div className="invalid-feedback">{formErrors.subCategory}</div>}
                </div>

                {/* Base Price */}
                <div className="form-group">
                  <label className="form-label">
                    <FaDollarSign /> Base Price <span>*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.basePrice ? 'is-invalid' : ''}`}
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    disabled={isSubmitting}
                  />
                  {formErrors.basePrice && <div className="invalid-feedback">{formErrors.basePrice}</div>}
                </div>

                {/* GST */}
                <div className="form-group">
                  <label className="form-label">
                    <FaPercentage /> GST Rate <span>*</span>
                  </label>
                  <select
                    className={`form-control ${formErrors.gst ? 'is-invalid' : ''}`}
                    value={formData.gst?.gstId || ""}
                    onChange={(e) => handleSelect("gst", gstList.find((g) => g.gstId === parseInt(e.target.value)))}
                    disabled={isSubmitting || gstLoading}
                  >
                    <option value="">Select GST</option>
                    {gstList.map((g) => (
                      <option key={g.gstId} value={g.gstId}>
                        {g.gstRate}%
                      </option>
                    ))}
                  </select>
                  {formErrors.gst && <div className="invalid-feedback">{formErrors.gst}</div>}
                </div>

                {/* Price with GST */}
                <div className="form-group">
                  <label className="form-label">Price with GST</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatCurrency(formData.priceWithGst)}
                    disabled
                    style={{ fontWeight: '600', color: 'var(--success)' }}
                  />
                </div>

                {/* Unit */}
                <div className="form-group">
                  <label className="form-label">
                    <FaBalanceScale /> Unit <span>*</span>
                  </label>
                  <select
                    className={`form-control ${formErrors.unit ? 'is-invalid' : ''}`}
                    value={formData.unit?.unitId || ""}
                    onChange={(e) => handleSelect("unit", units.find((u) => u.unitId === parseInt(e.target.value)))}
                    disabled={isSubmitting || unitLoading}
                  >
                    <option value="">Select Unit</option>
                    {Array.isArray(units) && units.map((u) => (
                      <option key={u.unitId} value={u.unitId}>
                        {u.unitName}
                      </option>
                    ))}
                  </select>
                  {formErrors.unit && <div className="invalid-feedback">{formErrors.unit}</div>}
                </div>

                {/* Discount */}
                <div className="form-group">
                  <label className="form-label">
                    <FaPercent /> Discount
                  </label>
                  <select
                    className="form-control"
                    value={formData.discount?.discountId || ""}
                    onChange={(e) => handleSelect("discount", discountList.find((d) => d.discountId === Number(e.target.value)))}
                    disabled={isSubmitting || discountLoading}
                  >
                    <option value="">Select Discount</option>
                    {discountList.map((d) => (
                      <option key={d.discountId} value={d.discountId}>
                        {d.discountName} ({d.discountValue})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rack Number */}
                <div className="form-group">
                  <label className="form-label">
                    <FaArchive /> Rack Number
                  </label>
                  <input
                    className="form-control"
                    name="rackNumber"
                    value={formData.rackNumber}
                    onChange={handleChange}
                    placeholder="Enter rack number"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">
                    <FaAlignLeft /> Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter product description"
                    rows="3"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Image Upload */}
                <div className="form-group">
                  <label className="form-label">
                    <FaImage /> Product Image
                  </label>
                  <div className="image-preview-container">
                    <input
                      type="file"
                      id="image-upload"
                      className="d-none"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="image-upload" className="image-upload-btn">
                      <FaUpload /> Choose Image
                    </label>
                    {preview && (
                      <img
                        src={preview}
                        alt="Product preview"
                        className="image-preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    )}
                  </div>
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
                      <FaCheck /> Update Product
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Product
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
              <FaBox /> Product List ({products.length} total)
            </h3>

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                className="search-input"
                placeholder="Search by product name, category..."
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
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Base Price</th>
                  <th>Price with GST</th>
                  <th>Unit</th>
                  <th>Image</th>
                  <th>Rack</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="loading-row">
                    <td colSpan="9">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSpinner className="fa-spin" /> Loading products...
                      </div>
                    </td>
                  </tr>
                ) : paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="9">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No products found{search && ` for "${search}"`}</p>
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
                  paginatedProducts.map((p) => {
                    const imageUrl = getImageUrl(p.image);
                    
                    return (
                      <tr key={p.PId}>
                        <td>
                          <span className="id-badge">#{p.PId}</span>
                        </td>
                        <td>
                          <strong>{p.pName}</strong>
                          {p.description && (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {p.description.length > 50 ? p.description.substring(0, 50) + '...' : p.description}
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <span className="category-badge">
                              {p.masterCategory?.name}
                            </span>
                            <span className="category-badge">
                              {p.mainCategory?.name}
                            </span>
                            <span className="category-badge">
                              {p.subCategory?.name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="price-display">
                            {formatCurrency(p.basePrice)}
                          </span>
                        </td>
                        <td>
                          <span className="price-gst">
                            {formatCurrency(p.priceWithGst)}
                          </span>
                          {p.gst && (
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              GST: {p.gst.gstRate}%
                            </div>
                          )}
                        </td>
                        <td>
                          {p.unit?.unitName && (
                            <span className="category-badge">
                              {p.unit.unitName}
                            </span>
                          )}
                        </td>
                        <td>
                          {imageUrl ? (
                            <div className="image-preview-container">
                              <img
                                src={imageUrl}
                                className="product-image"
                                alt={p.pName}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%2364748b'%3ENo Image%3C/text%3E%3C/svg%3E";
                                }}
                              />
                            </div>
                          ) : (
                            <div className="image-preview-container">
                              <div className="product-image" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'var(--bg-primary)',
                                color: 'var(--text-muted)',
                                fontSize: '11px',
                                fontWeight: '500'
                              }}>
                                No Image
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          {p.rackNumber && (
                            <span className="category-badge">
                              {p.rackNumber}
                            </span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn btn-edit"
                              onClick={() => handleEdit(p)}
                              title="Edit Product"
                              disabled={loading}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-btn btn-delete"
                              onClick={() => handleDelete(p.PId)}
                              title="Delete Product"
                              disabled={loading}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ================= PAGINATION ================= */}
          {products.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, products.length)} of{" "}
                {products.length} products
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

export default ProductMaster;