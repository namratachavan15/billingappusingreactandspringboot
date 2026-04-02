import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTimes, FaCheck, FaClock, FaShoppingBag, FaSpinner, FaUser, FaCalendar, FaLayerGroup, FaSitemap, FaBox, FaRuler, FaHashtag, FaDollarSign, FaPercent, FaCalculator, FaMinus, FaReceipt } from "react-icons/fa";
import { useCustomerContext } from "../States/CustomerContext";
import { useProductContext } from "../States/ProductContext";
import { useSaleContext } from "../States/SaleContext";
import { useMasterCategoryContext } from "../States/MasterCategoryContext";
import { useMainCategoryContext } from "../States/MainCategoryContext";
import { useSubCategoryContext } from "../States/SubCategoryContext";
import { useSizeContext } from "../States/SizeContext";
import "./Sale.css";

const initialItem = {
  masterCategory: null,
  mainCategory: null,
  subCategory: null,
  product: null,
  quantity: 1,
  unitPriceWithGst: 0,
  totalAmount: 0,
  size: null,
  discountPercent: 0,
};

const AddSale = () => {
  const today = new Date().toISOString().split("T")[0];

  const { customers, loading: customerLoading, fetchCustomers } = useCustomerContext();
  const { products, loading: productLoading, fetchProducts } = useProductContext();
  const { sales, loading: saleLoading, fetchSales, addSale, updateSale, deleteSale, searchSales } = useSaleContext();
const { categories: masterCategories, loading: masterLoading, getAllCategories } = useMasterCategoryContext();
const { categories: mainCategories, loading: mainLoading, getAllMainCategories } = useMainCategoryContext();
const { subCategories, loading: subLoading, getAllSubCategories } = useSubCategoryContext();
  const { fetchSizesByUnit } = useSizeContext();
  const [rowSizes, setRowSizes] = useState({});

  const [formData, setFormData] = useState({
    customer: null,
    saleDate: today,
    saleItems: [{ ...initialItem }],
  });

  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(sales.length / pageSize);
  const paginatedSales = sales.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

 useEffect(() => {
  fetchCustomers();
  fetchProducts();
  fetchSales();

  getAllCategories();
  getAllMainCategories();
  getAllSubCategories();
}, []);

  /* ===== Live Search ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) {
        searchSales(search);
      } else {
        fetchSales();
      }
      setPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  /* ===== Validation ===== */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customer)
      newErrors.customer = "Customer is required";

    if (!formData.saleDate)
      newErrors.saleDate = "Sale date is required";

    formData.saleItems.forEach((item, index) => {
      if (!item.masterCategory)
        newErrors[`master_${index}`] = "Master category required";

      if (!item.mainCategory)
        newErrors[`main_${index}`] = "Main category required";

      if (!item.subCategory)
        newErrors[`sub_${index}`] = "Sub category required";

      if (!item.product)
        newErrors[`product_${index}`] = "Product required";

      if (!item.quantity || item.quantity <= 0)
        newErrors[`qty_${index}`] = "Quantity must be greater than 0";

      if (!item.size)
        newErrors[`size_${index}`] = "Size required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===== Item Change ===== */
  const handleItemChange = async (index, field, value) => {
    const items = [...formData.saleItems];
    items[index][field] = value;

    if (field === "masterCategory") {
      items[index].mainCategory = null;
      items[index].subCategory = null;
      items[index].product = null;
      items[index].size = null;
      items[index].unitPriceWithGst = 0;
      items[index].totalAmount = 0;
      items[index].discountPercent = 0;
    }

    if (field === "mainCategory") {
      items[index].subCategory = null;
      items[index].product = null;
      items[index].size = null;
      items[index].unitPriceWithGst = 0;
      items[index].totalAmount = 0;
      items[index].discountPercent = 0;
    }

    if (field === "subCategory") {
      items[index].product = null;
      items[index].size = null;
      items[index].unitPriceWithGst = 0;
      items[index].totalAmount = 0;
      items[index].discountPercent = 0;
    }

    if (field === "product" && value) {
      items[index].size = null;
      items[index].unitPriceWithGst = value.priceWithGst || 0;
      items[index].discountPercent = value.discount?.discountValue || 0;

      if (value.unit?.unitId) {
        const sizes = await fetchSizesByUnit(value.unit.unitId);
        setRowSizes(prev => ({ ...prev, [index]: sizes }));
      }
    }

    // Calculate total amount
    const qty = Number(items[index].quantity) || 0;
    const price = items[index].unitPriceWithGst || 0;
    const discount = items[index].discountPercent || 0;
    const discountedPrice = price - (price * discount / 100);
    items[index].totalAmount = qty * discountedPrice;

    setFormData({ ...formData, saleItems: items });
    setErrors(prev => { 
      const copy = { ...prev }; 
      delete copy[`${field}_${index}`]; 
      return copy; 
    });
  };

  /* ===== Add/Remove Item Rows ===== */
  const addItemRow = () => {
    setFormData({
      ...formData,
      saleItems: [...formData.saleItems, { ...initialItem }],
    });
  };

  const removeItemRow = (index) => {
    if (formData.saleItems.length > 1) {
      const items = formData.saleItems.filter((_, i) => i !== index);
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
      setFormData({ ...formData, saleItems: items });
    }
  };

  /* ===== Submit ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        customer: { custId: formData.customer.custId },
        saleDate: formData.saleDate,
        saleItems: formData.saleItems.map((i) => ({
          product: { PId: i.product.PId },
          quantity: i.quantity,
          unitPriceWithGst: i.unitPriceWithGst,
          totalAmount: i.totalAmount,
          discountPercent: i.discountPercent,
          size: { sizeId: i.size.sizeId },
        })),
      };

      // Open print window first
      const printWindow = window.open("", "_blank");

      const savedSale = editId
        ? await updateSale(editId, payload)
        : await addSale(payload);

      // Then set location for printing
      if (savedSale && savedSale.saleId) {
        printWindow.location.href = `/print-bill/${savedSale.saleId}`;
      }

      alert("Sale completed successfully");
      resetForm();
    } catch (err) {
      const msg = err?.response?.data?.message || "Sale failed due to stock issue";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== Edit ===== */
  const handleEdit = async (sale) => {
    setEditId(sale.saleId);
  
    const items = await Promise.all(
      sale.saleItems.map(async (item, idx) => {
        // Resolve categories from CONTEXT lists
        const master = masterCategories.find(
          m => m.MACID === item.product.masterCategory?.MACID
        );
  
        const main = mainCategories.find(
          m => m.MCID === item.product.mainCategory?.MCID
        );
  
        const sub = subCategories.find(
          s => s.SCId === item.product.subCategory?.SCId
        );
  
        // Sizes
        let sizes = [];
        if (item.product?.unit?.unitId) {
          sizes = await fetchSizesByUnit(item.product.unit.unitId);
        }
  
        return {
          masterCategory: master || null,
          mainCategory: main || null,
          subCategory: sub || null,
          product: products.find(p => p.PId === item.product.PId) || null,
          size: item.size,
          quantity: item.quantity,
          unitPriceWithGst: item.unitPriceWithGst,
          totalAmount: item.totalAmount,
          discountPercent: item.discountPercent || 0,
          _sizes: sizes,
        };
      })
    );
  
    const newRowSizes = {};
    items.forEach((item, idx) => {
      newRowSizes[idx] = item._sizes;
      delete item._sizes;
    });
  
    setRowSizes(newRowSizes);
  
    setFormData({
      customer: customers.find(c => c.custId === sale.customer.custId),
      saleDate: sale.saleDate,
      saleItems: items,
    });
  
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  

  /* ===== Delete ===== */
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      await deleteSale(id);
    }
  };

  /* ===== Reset ===== */
  const resetForm = () => {
    setFormData({
      customer: null,
      saleDate: today,
      saleItems: [{ ...initialItem }],
    });
    setEditId(null);
    setErrors({});
    setRowSizes({});
  };

  /* ===== Helper Functions ===== */
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredMainCategories = (masterCategory) =>
    mainCategories.filter(m => m.masterCategory?.MACID === masterCategory?.MACID);

  const filteredSubCategories = (mainCategory) =>
    subCategories.filter(s => s.mainCategory?.MCID === mainCategory?.MCID);

  const filteredProducts = (subCategory) =>
    products.filter(p => p.subCategory?.SCId === subCategory?.SCId);

  // Calculate grand total
  const calculateGrandTotal = () => {
    return formData.saleItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
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
    <div className="sale-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Sales Management</h1>
        <p>Process, edit, or manage your sales transactions</p>
      </div>

      <div className="sale-grid">
        {/* ================= FORM CARD ================= */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>
              {editId ? (
                <>
                  <FaEdit /> Edit Sale
                </>
              ) : (
                <>
                  <FaShoppingBag /> New Sale
                </>
              )}
            </h3>
          </div>

          <div className="form-card-body">
            <form onSubmit={handleSubmit}>
              {/* Customer and Date */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    <FaUser /> Customer <span>*</span>
                  </label>
                  <select
                    className={`form-control ${errors.customer ? 'is-invalid' : ''}`}
                    value={formData.customer?.custId || ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setFormData({
                        ...formData,
                        customer: customers.find(c => c.custId === id),
                      });
                      if (errors.customer) {
                        setErrors(prev => {
                          const copy = { ...prev };
                          delete copy.customer;
                          return copy;
                        });
                      }
                    }}
                    disabled={isSubmitting || customerLoading}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.custId} value={c.custId}>
                        {c.name} - {c.mobile}
                      </option>
                    ))}
                  </select>
                  {errors.customer && <div className="invalid-feedback">{errors.customer}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaCalendar /> Sale Date <span>*</span>
                  </label>
                  <input
                    type="date"
                    className={`form-control ${errors.saleDate ? 'is-invalid' : ''}`}
                    value={formData.saleDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      saleDate: e.target.value,
                    })}
                    disabled={isSubmitting}
                  />
                  {errors.saleDate && <div className="invalid-feedback">{errors.saleDate}</div>}
                </div>
              </div>

              {/* Sale Items */}
              <div className="form-group">
                <label className="form-label">
                  <FaBox /> Sale Items
                </label>
                
                {formData.saleItems.map((item, idx) => (
                  <div key={idx} className="sale-item-card">
                    <div className="sale-item-header">
                      <span className="item-number">Item #{idx + 1}</span>
                      {formData.saleItems.length > 1 && (
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
                          className={`form-control ${errors[`master_${idx}`] ? 'is-invalid' : ''}`}
                          value={item.masterCategory?.MACID || ""}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "masterCategory",
                              masterCategories.find(c => c.MACID === Number(e.target.value))
                            )
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
                        {errors[`master_${idx}`] && <div className="invalid-feedback">{errors[`master_${idx}`]}</div>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Main Category</label>
                        <select
                          className={`form-control ${errors[`main_${idx}`] ? 'is-invalid' : ''}`}
                          value={item.mainCategory?.MCID || ""}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "mainCategory",
                              filteredMainCategories(item.masterCategory).find(c => c.MCID === Number(e.target.value))
                            )
                          }
                          disabled={isSubmitting || !item.masterCategory || mainLoading}
                        >
                          <option value="">Select Main Category</option>
                          {filteredMainCategories(item.masterCategory).map((c) => (
                            <option key={c.MCID} value={c.MCID}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {errors[`main_${idx}`] && <div className="invalid-feedback">{errors[`main_${idx}`]}</div>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Sub Category</label>
                        <select
                          className={`form-control ${errors[`sub_${idx}`] ? 'is-invalid' : ''}`}
                          value={item.subCategory?.SCId || ""}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "subCategory",
                              filteredSubCategories(item.mainCategory).find(s => s.SCId === Number(e.target.value))
                            )
                          }
                          disabled={isSubmitting || !item.mainCategory || subLoading}
                        >
                          <option value="">Select Sub Category</option>
                          {filteredSubCategories(item.mainCategory).map((s) => (
                            <option key={s.SCId} value={s.SCId}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        {errors[`sub_${idx}`] && <div className="invalid-feedback">{errors[`sub_${idx}`]}</div>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Product</label>
                        <select
                          className={`form-control ${errors[`product_${idx}`] ? 'is-invalid' : ''}`}
                          value={item.product?.PId || ""}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "product",
                              filteredProducts(item.subCategory).find(p => p.PId === Number(e.target.value))
                            )
                          }
                          disabled={isSubmitting || !item.subCategory || productLoading}
                        >
                          <option value="">Select Product</option>
                          {filteredProducts(item.subCategory).map((p) => (
                            <option key={p.PId} value={p.PId}>
                              {p.pName} ({p.productCode || p.PId})
                            </option>
                          ))}
                        </select>
                        {errors[`product_${idx}`] && <div className="invalid-feedback">{errors[`product_${idx}`]}</div>}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="item-row-details">
                      {/* Size */}
                      <div className="form-group item-col-1-5">
                        <label className="form-label">
                          <FaRuler /> Size
                        </label>
                        <select
                          className={`form-control ${errors[`size_${idx}`] ? 'is-invalid' : ''}`}
                          value={item.size?.sizeId || ""}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "size",
                              rowSizes[idx]?.find(s => s.sizeId === Number(e.target.value))
                            )
                          }
                          disabled={isSubmitting || !rowSizes[idx]}
                        >
                          <option value="">Select Size</option>
                          {rowSizes[idx]?.map((s) => (
                            <option key={s.sizeId} value={s.sizeId}>
                              {s.sizeDisplay}
                            </option>
                          ))}
                        </select>
                        {errors[`size_${idx}`] && <div className="invalid-feedback">{errors[`size_${idx}`]}</div>}
                      </div>

                      {/* Quantity */}
                      <div className="form-group item-col-1-5">
                        <label className="form-label">
                          <FaHashtag /> Quantity
                        </label>
                        <input
                          type="number"
                          className={`form-control ${errors[`qty_${idx}`] ? 'is-invalid' : ''}`}
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(
                              idx,
                              "quantity",
                              Number(e.target.value)
                            )
                          }
                          min="1"
                          disabled={isSubmitting}
                        />
                        {errors[`qty_${idx}`] && <div className="invalid-feedback">{errors[`qty_${idx}`]}</div>}
                      </div>

                      {/* Price */}
                      <div className="form-group item-col-1-5">
                        <label className="form-label">
                          <FaDollarSign /> Price
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formatCurrency(item.unitPriceWithGst)}
                          disabled
                          style={{ fontWeight: '600' }}
                        />
                      </div>

                      {/* Discount */}
                      <div className="form-group item-col-1-5">
                        <label className="form-label">
                          <FaPercent /> Disc %
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={`${item.discountPercent}%`}
                          disabled
                          style={{ color: 'var(--success)' }}
                        />
                      </div>

                      {/* Total */}
                      <div className="form-group item-col-1-5">
                        <label className="form-label">Total</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formatCurrency(item.totalAmount)}
                          disabled
                          style={{
                            fontWeight: '600',
                            color: 'var(--success)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Item Button */}
                <button
                  type="button"
                  className="add-item-btn"
                  onClick={addItemRow}
                  disabled={isSubmitting}
                >
                  <FaPlus /> Add Another Item
                </button>
              </div>

              {/* Grand Total */}
              <div className="grand-total">
                <h4>
                  <FaCalculator /> Grand Total
                </h4>
                <h3>{formatCurrency(calculateGrandTotal())}</h3>
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
                      <FaCheck /> Update Sale
                    </>
                  ) : (
                    <>
                      <FaReceipt /> Complete Sale
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
              <FaShoppingBag /> Sales History ({sales.length} total)
            </h3>

            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                className="search-input"
                placeholder="Search by customer, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={saleLoading}
              />
              <span className="search-hint">Type to search instantly</span>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {saleLoading ? (
                  <tr className="loading-row">
                    <td colSpan="6">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <FaSpinner className="fa-spin" /> Loading sales...
                      </div>
                    </td>
                  </tr>
                ) : paginatedSales.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <FaSearch />
                        <p>No sales found{search && ` for "${search}"`}</p>
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
                  paginatedSales.map((sale) => (
                    <tr key={sale.saleId}>
                      <td>
                        <span className="id-badge">#{sale.saleId}</span>
                      </td>
                      <td>
                        <strong>{sale.customer?.name}</strong>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {sale.customer?.mobile}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                          {formatDate(sale.saleDate)}
                        </span>
                      </td>
                      <td>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                          {sale.saleItems?.map((item, idx) => (
                            <div key={idx} className="product-badge" style={{ marginBottom: '8px' }}>
                              <div>
                                <strong>{item.product?.pName}</strong>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                  {item.quantity} x {formatCurrency(item.unitPriceWithGst)} 
                                  {item.size && ` | Size: ${item.size.sizeDisplay}`}
                                  {item.discountPercent > 0 && ` | Discount: ${item.discountPercent}%`}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--success)' }}>
                                  Total: {formatCurrency(item.totalAmount)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--success)' }}>
                          {formatCurrency(sale.totalAmt)}
                        </strong>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn btn-edit"
                            onClick={() => handleEdit(sale)}
                            title="Edit Sale"
                            disabled={saleLoading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="action-btn btn-delete"
                            onClick={() => handleDelete(sale.saleId)}
                            title="Delete Sale"
                            disabled={saleLoading}
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
          {sales.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(page - 1) * pageSize + 1} to{" "}
                {Math.min(page * pageSize, sales.length)} of{" "}
                {sales.length} sales
              </div>

              <div className="pagination-controls">
                <button
                  className="page-btn page-nav"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || saleLoading}
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
                      disabled={saleLoading}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  className="page-btn page-nav"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || saleLoading}
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

export default AddSale;