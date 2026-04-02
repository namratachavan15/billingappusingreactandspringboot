import React, { useEffect, useState } from "react";
import { useStock } from "../States/StockContext";
import {
  FaSearch,
  FaSpinner,
  FaBox,
  FaCube,
  FaRuler,
  FaBalanceScale,
  FaHashtag,
  FaDollarSign,
  FaPercent,
  FaWarehouse,
  FaLayerGroup,
  FaSitemap,
  FaTag,
  FaBarcode,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter
} from "react-icons/fa";

const StockPage = () => {
  const { stocks } = useStock();
  const [searchKey, setSearchKey] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  console.log("stocks",stocks);
  
  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredStocks.length / pageSize);
  const paginatedStocks = filteredStocks.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Live Search ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!searchKey.trim()) {
        setFilteredStocks(stocks);
      } else {
        setFilteredStocks(
          stocks.filter((s) =>
            s.product?.pName?.toLowerCase().includes(searchKey.toLowerCase()) ||
            s.product?.PId?.toString().includes(searchKey) ||
            s.product?.masterCategory?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
            s.product?.mainCategory?.name?.toLowerCase().includes(searchKey.toLowerCase()) ||
            s.product?.subCategory?.name?.toLowerCase().includes(searchKey.toLowerCase())
          )
        );
      }
      setPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [stocks, searchKey]);

  /* ===== Helper Functions ===== */
  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        icon: <FaTimesCircle />
      };
    } else if (quantity < 5) {
      return {
        label: "Low Stock",
        color: "#f59e0b",
        bgColor: "rgba(245, 158, 11, 0.1)",
        icon: <FaExclamationTriangle />
      };
    } else {
      return {
        label: "In Stock",
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
        icon: <FaCheckCircle />
      };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate statistics
  const totalProducts = filteredStocks.length;
  const totalStockValue = filteredStocks.reduce((sum, s) => {
    const qty = s.quantity || 0;
    const price = s.product?.priceWithGst || 0;
    return sum + (qty * price);
  }, 0);
  const outOfStockItems = filteredStocks.filter(s => (s.quantity || 0) === 0).length;
  const lowStockItems = filteredStocks.filter(s => (s.quantity || 0) > 0 && (s.quantity || 0) < 5).length;

  return (
    <div className="sale-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Stock Management</h1>
        <p>Monitor and manage your inventory stock levels</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <FaBox />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Products</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{totalProducts}</div>
          </div>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <FaDollarSign />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Stock Value</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(totalStockValue)}</div>
          </div>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <FaExclamationTriangle />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Low Stock</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{lowStockItems}</div>
          </div>
        </div>

        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            <FaTimesCircle />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Out of Stock</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{outOfStockItems}</div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card" style={{
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
        width: '100%'
      }}>
        <div className="table-header">
          <h3>
            <FaBox /> Stock Inventory ({filteredStocks.length} items)
          </h3>

          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by product name, code, or category..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <span className="search-hint">Type to search instantly</span>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>HSN/Code</th>
                <th>Category</th>
                <th>Size</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Base Price</th>
                <th>MRP</th>
                <th>GST %</th>
                <th>Rack</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStocks.length === 0 ? (
                <tr>
                  <td colSpan="10">
                    <div className="empty-state">
                      <FaSearch />
                      <p>No stock items found{searchKey && ` for "${searchKey}"`}</p>
                      {searchKey && (
                        <button
                          className="btn btn-outline"
                          onClick={() => setSearchKey("")}
                          style={{
                            padding: '8px 16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStocks.map((s) => {
                  const qty = s.quantity || 0;
                  const status = getStockStatus(qty);
                  
                  return (
                    <tr key={s.stockId}>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>{s.product?.pName || '-'}</strong>
                        {s.product?.productCode && (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <FaTag style={{ marginRight: '4px', fontSize: '10px' }} />
                            {s.product.productCode}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="id-badge">
                          <FaBarcode style={{ marginRight: '6px', fontSize: '12px' }} />
                          {s.product?.PId || '-'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div className="category-badge" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: 'var(--primary)',
                            width: 'fit-content'
                          }}>
                            <FaLayerGroup /> {s.product?.masterCategory?.name || '-'}
                          </div>
                          <div className="category-badge" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: 'var(--secondary)',
                            width: 'fit-content'
                          }}>
                            <FaSitemap /> {s.product?.mainCategory?.name || '-'}
                          </div>
                          <div className="category-badge" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: 'var(--accent)',
                            width: 'fit-content'
                          }}>
                            <FaCube /> {s.product?.subCategory?.name || '-'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaRuler style={{ color: 'var(--text-muted)', fontSize: '14px' }} />
                          <span>{s.size?.sizeDisplay || '-'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaBalanceScale style={{ color: 'var(--text-muted)', fontSize: '14px' }} />
                          <span>{s.product?.unit?.unitName || 'PC'}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: status.color
                          }}>
                            {status.icon}
                          </div>
                          <div>
                            <strong style={{ color: status.color }}>{qty}</strong>
                            <div style={{
                              fontSize: '11px',
                              color: status.color,
                              background: status.bgColor,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              marginTop: '2px',
                              display: 'inline-block'
                            }}>
                              {status.label}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          {formatCurrency(s.product?.basePrice)}
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--success)', fontSize: '14px' }}>
                          {formatCurrency(s.product?.priceWithGst)}
                        </strong>
                      </td>
                      <td>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(245, 158, 11, 0.1)',
                          color: 'var(--warning)',
                          fontWeight: '600'
                        }}>
                          <FaPercent style={{ fontSize: '10px' }} />
                          {s.product?.gst?.gstRate || 0}%
                        </div>
                      </td>
                      <td>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px'
                        }}>
                          <FaWarehouse style={{ color: 'var(--text-muted)', fontSize: '14px' }} />
                          <span>{s.product?.rackNumber || '-'}</span>
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
        {filteredStocks.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filteredStocks.length)} of{" "}
              {filteredStocks.length} items
            </div>

            <div className="pagination-controls">
              <button
                className="page-btn page-nav"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
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
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                className="page-btn page-nav"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPage;