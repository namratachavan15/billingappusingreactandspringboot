import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock, FaShoppingCart, FaSpinner, FaBox, FaLayerGroup, FaSitemap, FaTag, FaCalendar, FaDollarSign, FaHashtag, FaPercentage, FaCalculator, FaMinus } from "react-icons/fa";
import { usePurchaseContext } from "../States/PurchaseContext";
import { useSupplierContext } from "../States/SupplierContext";
import { useMasterCategoryContext } from "../States/MasterCategoryContext";
import { useMainCategoryContext } from "../States/MainCategoryContext";
import { useSubCategoryContext } from "../States/SubCategoryContext";
import { useProductContext } from "../States/ProductContext";
import { useGstMasterContext } from "../States/GstMasterContext";
import { useStock } from "../States/StockContext";
import { useSizeContext } from "../States/SizeContext";
import "./Purchase.css";

const initialItem = {
  masterCategory: null,
  mainCategory: null,
  subCategory: null,
  product: null,
  purchasePrice: "",
  quantity: "",
  gst: null,
  totalAmount: 0,
  batchNo: "",
  expiryDate: "",
  size: null
};

const AddPurchase = () => {
  const {
    purchases,
    loading,
    fetchPurchases,
    searchPurchases,
    addPurchase,
    updatePurchase,
    deletePurchase,
  } = usePurchaseContext();

  const { suppliers, fetchSuppliers, loading: supplierLoading } = useSupplierContext();
  const { categories: masterCategories, loading: masterLoading } = useMasterCategoryContext();
  const { categories: mainCategories, loading: mainLoading } = useMainCategoryContext();
  const { subCategories, loading: subLoading } = useSubCategoryContext();
  const { products, loading: productLoading } = useProductContext();
  const { gstList, loading: gstLoading } = useGstMasterContext();
  const { fetchSizesByUnit } = useSizeContext();
  const { fetchStocks } = useStock();

  const [formData, setFormData] = useState({
    supplier: null,
    purchaseDate: "",
    purchaseItems: [{ ...initialItem }]
  });

  const [editId, setEditId] = useState(null);
  const [rowSizes, setRowSizes] = useState({});
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(purchases.length / pageSize);
  const paginatedPurchases = purchases.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Initial Load ===== */
  useEffect(() => {
    fetchSuppliers();
    searchPurchases(""); // unified logic
  }, []);
  

  /* ===== Live Search with Debounce ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      searchPurchases(search);
      setPage(1);
    }, 400);
  
    return () => clearTimeout(delay);
  }, [search]);
  

  /* ===== Handle Item Change ===== */
  const handleItemChange = (index, field, value) => {
    const items = [...formData.purchaseItems];
    items[index][field] = value;

    // Calculate total amount
    const price = parseFloat(items[index].purchasePrice) || 0;
    const qty = parseFloat(items[index].quantity) || 0;
    const gstRate = parseFloat(items[index].gst?.gstRate) || 0;
    const subtotal = price * qty;
    const gstAmount = (subtotal * gstRate) / 100;
    items[index].totalAmount = subtotal + gstAmount;

    setFormData({ ...formData, purchaseItems: items });
  };

  /* ===== Add/Remove Item Rows ===== */
  const addItemRow = () => {
    setFormData({
      ...formData,
      purchaseItems: [...formData.purchaseItems, { ...initialItem }]
    });
  };

  const removeItemRow = (index) => {
    if (formData.purchaseItems.length > 1) {
      const items = formData.purchaseItems.filter((_, i) => i !== index);
      setRowSizes(prev => {
        const newRowSizes = { ...prev };
        delete newRowSizes[index];
        // Reindex remaining sizes
        const updated = {};
        Object.keys(newRowSizes).forEach(key => {
          const keyNum = parseInt(key);
          if (keyNum > index) {
            updated[keyNum - 1] = newRowSizes[key];
          } else if (keyNum < index) {
            updated[keyNum] = newRowSizes[key];
          }
        });
        return updated;
      });
      setFormData({ ...formData, purchaseItems: items });
    }
  };

  /* ===== Submit ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.supplier) {
      alert("Please select a supplier");
      return;
    }
    if (!formData.purchaseDate) {
      alert("Please select a purchase date");
      return;
    }
    
    // Validate each item
    for (let i = 0; i < formData.purchaseItems.length; i++) {
      const item = formData.purchaseItems[i];
      if (!item.product) {
        alert(`Please select a product for item ${i + 1}`);
        return;
      }
      if (!item.purchasePrice || parseFloat(item.purchasePrice) <= 0) {
        alert(`Please enter a valid price for item ${i + 1}`);
        return;
      }
      if (!item.quantity || parseFloat(item.quantity) <= 0) {
        alert(`Please enter a valid quantity for item ${i + 1}`);
        return;
      }
      if (!item.gst) {
        alert(`Please select GST for item ${i + 1}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        supplier: { supId: formData.supplier.supId },
        purchaseDate: formData.purchaseDate,
        purchaseItems: formData.purchaseItems.map(item => ({
          product: { PId: item.product.PId },
          purchasePrice: parseFloat(item.purchasePrice),
          quantity: parseFloat(item.quantity),
          gstRate: parseFloat(item.gst.gstRate),
          totalAmount: item.totalAmount,
          batchNo: item.batchNo,
          expiryDate: item.expiryDate,
          size: item.size ? { sizeId: item.size.sizeId } : null
        }))
      };

      if (editId) {
        await updatePurchase(editId, payload);
      } else {
        await addPurchase(payload);
      }
      
      fetchStocks();
      resetForm();
    } catch (error) {
      console.error("Error submitting purchase:", error);
      alert("Error saving purchase. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== Edit ===== */
  const handleEdit = async (purchase) => {
    setEditId(purchase.purId);
    setFormData({
      supplier: purchase.supplier,
      purchaseDate: purchase.purchaseDate,
      purchaseItems: purchase.purchaseItems.map((item, idx) => ({
        masterCategory: item.product.masterCategory,
        mainCategory: item.product.mainCategory,
        subCategory: item.product.subCategory,
        product: item.product,
        purchasePrice: item.purchasePrice,
        quantity: item.quantity,
        gst: { gstRate: item.gstRate, gstId: item.gstId },
        totalAmount: item.totalAmount,
        batchNo: item.batchNo || "",
        expiryDate: item.expiryDate || "",
        size: item.size || null,
      }))
    });

    // Fetch sizes for each item
    const sizesMap = {};
    for (let i = 0; i < purchase.purchaseItems.length; i++) {
      const item = purchase.purchaseItems[i];
      if (item.product?.unit?.unitId) {
        const sizes = await fetchSizesByUnit(item.product.unit.unitId);
        sizesMap[i] = sizes;
      }
    }
    setRowSizes(sizesMap);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== Delete ===== */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      await deletePurchase(id);
    }
  };

  /* ===== Reset ===== */
  const resetForm = () => {
    setFormData({
      supplier: null,
      purchaseDate: "",
      purchaseItems: [{ ...initialItem }]
    });
    setEditId(null);
    setRowSizes({});
  };

  /* ===== Page Change ===== */
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== Helper Functions ===== */
  const filteredMainCategories = (masterCategory) => 
    mainCategories.filter(m => m.masterCategory?.MACID === masterCategory?.MACID);

  const filteredSubCategories = (mainCategory) => 
    subCategories.filter(s => s.mainCategory?.MCID === mainCategory?.MCID);

  const filteredProducts = (subCategory) => {
    if (!Array.isArray(products) || !subCategory) return [];
    return products.filter(p => p.subCategory?.SCId === subCategory.SCId);
  };

  // Calculate total purchase amount
  const calculateTotal = () => {
    return formData.purchaseItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
    <div className="purchase-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Purchase Management</h1>
        <p>Add, edit, or manage your product purchases</p>
      </div>

      <div className="purchase-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Purchase
                </>
              ) : (
                <>
                  <FaShoppingCart /> New Purchase
                </>
              )}
            </h3>
          </div>

          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              {/* Supplier and Date */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    <FaTag /> Supplier <span>*</span>
                  </label>
                  <select
                    className="form-control"
                    value={formData.supplier?.supId || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      supplier: suppliers.find(s => s.supId === parseInt(e.target.value))
                    })}
                    disabled={isSubmitting || supplierLoading}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(s => (
                      <option key={s.supId} value={s.supId}>
                        {s.supName} - {s.mob}
                      </option>
                    ))}
                  </select>
                  {supplierLoading && <small className="text-muted">Loading suppliers...</small>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaCalendar /> Purchase Date <span>*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      purchaseDate: e.target.value
                    })}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Purchase Items */}
              <div className="form-group">
                <label className="form-label">
                  <FaBox /> Purchase Items
                </label>
                
                {formData.purchaseItems.map((item, idx) => (
                  <div key={idx} className="purchase-item-card">
                    <div className="purchase-item-header">
                      <span className="item-number">Item #{idx + 1}</span>
                      {formData.purchaseItems.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeItemRow(idx)}
                          disabled={isSubmitting}
                        >
                          <FaMinus /> Remove
                        </button>
                      )}
                    </div>

                    {/* Category Selection */}
                    <div className="item-row-category">
                      <div className="form-group">
                        <label className="form-label">Master Category</label>
                        <select
                          className="form-control"
                          value={item.masterCategory?.MACID || ""}
                          onChange={(e) => handleItemChange(
                            idx,
                            "masterCategory",
                            masterCategories.find(c => c.MACID === parseInt(e.target.value))
                          )}
                          disabled={isSubmitting || masterLoading}
                        >
                          <option value="">Select Master Category</option>
                          {masterCategories.map(c => (
                            <option key={c.MACID} value={c.MACID}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Main Category</label>
                        <select
                          className="form-control"
                          value={item.mainCategory?.MCID || ""}
                          onChange={(e) => handleItemChange(
                            idx,
                            "mainCategory",
                            mainCategories.find(c => c.MCID === parseInt(e.target.value))
                          )}
                          disabled={isSubmitting || !item.masterCategory || mainLoading}
                        >
                          <option value="">Select Main Category</option>
                          {filteredMainCategories(item.masterCategory).map(m => (
                            <option key={m.MCID} value={m.MCID}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Sub Category</label>
                        <select
                          className="form-control"
                          value={item.subCategory?.SCId || ""}
                          onChange={(e) => handleItemChange(
                            idx,
                            "subCategory",
                            subCategories.find(s => s.SCId === parseInt(e.target.value))
                          )}
                          disabled={isSubmitting || !item.mainCategory || subLoading}
                        >
                          <option value="">Select Sub Category</option>
                          {filteredSubCategories(item.mainCategory).map(s => (
                            <option key={s.SCId} value={s.SCId}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="item-row-details">
                      {/* Product */}
                      <div className="form-group">
                        <label className="form-label">Product</label>
                        <select
                          className="form-control"
                          value={item.product?.PId || ""}
                          onChange={async (e) => {
                            const product = filteredProducts(item.subCategory)
                              .find(p => p.PId === parseInt(e.target.value));
                            
                            handleItemChange(idx, "product", product);
                            handleItemChange(idx, "size", null);
                            
                            if (product?.unit?.unitId) {
                              const sizes = await fetchSizesByUnit(product.unit.unitId);
                              setRowSizes(prev => ({ ...prev, [idx]: sizes }));
                            }
                          }}
                          disabled={isSubmitting || !item.subCategory || productLoading}
                        >
                          <option value="">Select Product</option>
                          {filteredProducts(item.subCategory).map(p => (
                            <option key={p.PId} value={p.PId}>
                              {p.pName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Size */}
                      <div className="form-group">
                        <label className="form-label">Size</label>
                        <select
                          className="form-control"
                          value={item.size?.sizeId || ""}
                          onChange={(e) => handleItemChange(
                            idx,
                            "size",
                            rowSizes[idx]?.find(s => s.sizeId === parseInt(e.target.value))
                          )}
                          disabled={isSubmitting || !rowSizes[idx]}
                        >
                          <option value="">Select Size</option>
                          {rowSizes[idx]?.map(s => (
                            <option key={s.sizeId} value={s.sizeId}>
                              {s.sizeDisplay}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Batch */}
                      <div className="form-group">
                        <label className="form-label">Batch No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={item.batchNo}
                          onChange={(e) => handleItemChange(idx, "batchNo", e.target.value)}
                          placeholder="Batch"
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Expiry */}
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={item.expiryDate}
                          onChange={(e) => handleItemChange(idx, "expiryDate", e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Price */}
                      <div className="form-group">
                        <label className="form-label">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.purchasePrice}
                          onChange={(e) => handleItemChange(idx, "purchasePrice", e.target.value)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* Quantity */}
                      <div className="form-group">
                        <label className="form-label">Qty</label>
                        <input
                          type="number"
                          className="form-control"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                          placeholder="0"
                          min="1"
                          step="1"
                          disabled={isSubmitting}
                        />
                      </div>

                      {/* GST */}
                      <div className="form-group">
                        <label className="form-label">GST %</label>
                        <select
                          className="form-control"
                          value={item.gst?.gstId || ""}
                          onChange={(e) => handleItemChange(
                            idx,
                            "gst",
                            gstList.find(g => g.gstId === parseInt(e.target.value))
                          )}
                          disabled={isSubmitting || gstLoading}
                        >
                          <option value="">Select GST</option>
                          {gstList.map(g => (
                            <option key={g.gstId} value={g.gstId}>
                              {g.gstRate}%
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Total */}
                      <div className="form-group">
                        <label className="form-label">Total</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formatCurrency(item.totalAmount)}
                          readOnly
                          style={{ fontWeight: '600', color: 'var(--success)' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-secondary mb-3"
                  onClick={addItemRow}
                  disabled={isSubmitting}
                >
                  <FaPlus /> Add Another Item
                </button>
              </div>

              {/* Grand Total */}
              <div className="form-group" style={{ 
                backgroundColor: 'var(--bg-primary)', 
                padding: '20px', 
                borderRadius: 'var(--radius)',
                border: '2px solid var(--primary)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>
                    <FaCalculator /> Grand Total
                  </h4>
                  <h3 style={{ margin: 0, color: 'var(--success)' }}>
                    {formatCurrency(calculateTotal())}
                  </h3>
                </div>
              </div>

              {/* Form Actions */}
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
                      <FaCheck /> Update Purchase
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> Save Purchase
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
              <FaShoppingCart /> Purchase History ({purchases.length} total)
            </h3>

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by supplier, product, batch..."
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
                  <th>Supplier</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr className="loading-row">
                    <td colSpan="6">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSpinner className="fa-spin" /> Loading purchases...
                      </div>
                    </td>
                  </tr>
                ) : paginatedPurchases.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No purchases found{search && ` for "${search}"`}</p>
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
                  paginatedPurchases.map((purchase) => (
                    <tr key={purchase.purId}>
                      <td>
                        <span className="id-badge">#{purchase.purId}</span>
                      </td>
                      <td>
                        <strong>{purchase.supplier?.supName}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {purchase.supplier?.mob}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          {formatDate(purchase.purchaseDate)}
                        </span>
                      </td>
                      <td>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {purchase.purchaseItems?.map((item, idx) => (
                            <div key={idx} className="product-badge" style={{ marginBottom: '8px' }}>
                              <div>
                                <strong>{item.product?.pName}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {item.quantity} x {formatCurrency(item.purchasePrice)} 
                                  {item.size && ` | Size: ${item.size.sizeDisplay}`}
                                  {item.batchNo && ` | Batch: ${item.batchNo}`}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--success)' }}>
                                  GST: {item.gstRate}% | Total: {formatCurrency(item.totalAmount)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--success)' }}>
                          {formatCurrency(purchase.totalAmt)}
                        </strong>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => handleEdit(purchase)}
                            title="Edit Purchase"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(purchase.purId)}
                            title="Delete Purchase"
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
          {purchases.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, purchases.length)} of{" "}
                {purchases.length} purchases
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

export default AddPurchase;