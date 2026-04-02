import React, { useState, useEffect } from "react";
import { api } from "../Config/api";
import { useAuth } from "../States/AuthContext";
import {
  FaSearch,
  FaSpinner,
  FaChartLine,
  FaMoneyBillWave,
  FaShoppingCart,
  FaPercentage,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFileExport,
  FaFilter,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaBox,
  FaInfoCircle
} from "react-icons/fa";

export default function ProfitLossReport() {
  const { user } = useAuth();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filteredReport, setFilteredReport] = useState([]);
  
  /* ===== Sorting State ===== */
  const [sortConfig, setSortConfig] = useState({
    key: 'profit',
    direction: 'desc'
  });
  
  /* ===== Pagination ===== */
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const totalPages = Math.ceil(filteredReport.length / pageSize);
  const paginatedReport = filteredReport.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* ===== Summary Statistics ===== */
  const [summary, setSummary] = useState({
    totalProfit: 0,
    totalLoss: 0,
    totalSales: 0,
    totalPurchase: 0,
    avgMargin: 0,
    profitableItems: 0,
    lossItems: 0
  });

  useEffect(() => {
    if (user?.shopId) {
      fetchReport();
    }
  }, [user]);

  /* ===== Live Search ===== */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!searchKey.trim()) {
        setFilteredReport(report);
      } else {
        setFilteredReport(
          report.filter((item) =>
            item.productName?.toLowerCase().includes(searchKey.toLowerCase())
          )
        );
      }
      setPage(1);
    }, 300);

    return () => clearTimeout(delay);
  }, [report, searchKey]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/reports/profit-loss?shopId=${user.shopId}`);
      console.log("Profit Loss Data:", res.data);
      
      if (res.data && Array.isArray(res.data)) {
        setReport(res.data);
        setFilteredReport(res.data);
        calculateSummary(res.data);
      }
    } catch (error) {
      console.error("Error fetching profit/loss report", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data) => {
    const summaryData = {
      totalProfit: 0,
      totalLoss: 0,
      totalSales: 0,
      totalPurchase: 0,
      avgMargin: 0,
      profitableItems: 0,
      lossItems: 0
    };

    data.forEach(item => {
      const profit = item.profit || 0;
      if (profit >= 0) {
        summaryData.totalProfit += profit;
        summaryData.profitableItems++;
      } else {
        summaryData.totalLoss += Math.abs(profit);
        summaryData.lossItems++;
      }
      
      summaryData.totalSales += item.totalSalesAmount || 0;
      summaryData.totalPurchase += item.totalPurchaseAmount || 0;
    });

    summaryData.avgMargin = data.length > 0 
      ? data.reduce((sum, item) => sum + (item.marginPercent || 0), 0) / data.length 
      : 0;

    setSummary(summaryData);
  };

  /* ===== Sorting ===== */
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sorted = [...filteredReport].sort((a, b) => {
      const aValue = a[key] || 0;
      const bValue = b[key] || 0;
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    setFilteredReport(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="text-blue-600" /> 
      : <FaSortDown className="text-blue-600" />;
  };

  /* ===== Formatting Functions ===== */
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

  const exportToCSV = () => {
    const headers = ["Product Name", "Total Purchase", "Total Sales", "Profit/Loss", "Margin %"];
    const csvContent = [
      headers.join(","),
      ...filteredReport.map(row => [
        `"${row.productName || ''}"`,
        row.totalPurchaseAmount?.toFixed(2) || '0.00',
        row.totalSalesAmount?.toFixed(2) || '0.00',
        row.profit?.toFixed(2) || '0.00',
        row.marginPercent?.toFixed(2) || '0.00'
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `profit-loss-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProfitStatus = (profit) => {
    if (profit >= 0) {
      return {
        label: "Profit",
        color: "#10b981",
        bgColor: "rgba(16, 185, 129, 0.1)",
        icon: <FaArrowUp className="text-green-500" />
      };
    } else {
      return {
        label: "Loss",
        color: "#ef4444",
        bgColor: "rgba(239, 68, 68, 0.1)",
        icon: <FaArrowDown className="text-red-500" />
      };
    }
  };

  return (
    <div className="report-container" style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #f8fafc)',
      padding: '25px',
      marginLeft:'260px'
    }}>
      {/* Page Header */}
      <div className="page-header" style={{
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: 'var(--text-primary, #1e293b)',
          marginBottom: '8px'
        }}>
          <FaChartLine style={{ marginRight: '12px', color: 'var(--primary, #3b82f6)' }} />
          Profit & Loss Report
        </h1>
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary, #64748b)',
          marginBottom: '24px'
        }}>
          {user?.shopName} • Financial performance analysis
        </p>
      </div>

      {/* Summary Statistics Cards */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Total Profit Card */}
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius, 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
            <FaMoneyBillWave />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Profit</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(summary.totalProfit)}</div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
              {summary.profitableItems} profitable items
            </div>
          </div>
        </div>

        {/* Total Loss Card */}
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius, 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
            <FaMoneyBillWave />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Loss</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatCurrency(summary.totalLoss)}</div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
              {summary.lossItems} loss-making items
            </div>
          </div>
        </div>

        {/* Average Margin Card */}
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius, 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
            <FaPercentage />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Average Margin</div>
            <div style={{ fontSize: '24px', fontWeight: '700' }}>{summary.avgMargin.toFixed(2)}%</div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
              {summary.avgMargin >= 20 ? 'Excellent' : summary.avgMargin >= 10 ? 'Good' : 'Needs improvement'}
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="stat-card" style={{
          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
          color: 'white',
          padding: '20px',
          borderRadius: 'var(--radius, 12px)',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
            <FaChartLine />
          </div>
          <div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Net Profit</div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '700',
              color: (summary.totalProfit - summary.totalLoss) >= 0 ? '#ffffff' : '#fecaca'
            }}>
              {formatCurrency(summary.totalProfit - summary.totalLoss)}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>
              {(summary.totalProfit - summary.totalLoss) >= 0 ? 'Positive' : 'Negative'} performance
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-card" style={{
        background: 'var(--bg-surface, #ffffff)',
        borderRadius: 'var(--radius-lg, 16px)',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: 'var(--shadow, 0 1px 3px 0 rgba(0, 0, 0, 0.1))',
        overflow: 'hidden',
        width: '100%'
      }}>
        {/* Table Header with Search */}
        <div className="table-header" style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text-primary, #1e293b)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaBox /> Profit/Loss Details ({filteredReport.length} items)
              </h3>
              {loading && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: 'var(--text-muted, #94a3b8)'
                }}>
                  <FaSpinner className="animate-spin" /> Loading...
                </div>
              )}
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button
                onClick={exportToCSV}
                disabled={filteredReport.length === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--primary, #3b82f6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius, 8px)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: filteredReport.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: filteredReport.length > 0 ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
              >
                <FaFileExport /> Export CSV
              </button>
              
              <button
                onClick={fetchReport}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: 'var(--bg-secondary, #f1f5f9)',
                  color: 'var(--text-primary, #1e293b)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: 'var(--radius, 8px)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <FaFilter /> Refresh Data
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="search-container" style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px'
          }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted, #94a3b8)',
              fontSize: '16px'
            }} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: 'var(--radius, 8px)',
                fontSize: '14px',
                backgroundColor: 'var(--bg-primary, #f8fafc)',
                color: 'var(--text-primary, #1e293b)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="table-container" style={{
          overflowX: 'auto',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <table className="data-table" style={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: '800px'
          }}>
            <thead style={{
              backgroundColor: 'var(--bg-secondary, #f8fafc)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <tr>
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-color, #e2e8f0)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap'
                }} onClick={() => handleSort('productName')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Product
                    {getSortIcon('productName')}
                  </div>
                </th>
                
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-color, #e2e8f0)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap'
                }} onClick={() => handleSort('totalPurchaseAmount')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Total Purchase
                    {getSortIcon('totalPurchaseAmount')}
                  </div>
                </th>
                
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-color, #e2e8f0)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap'
                }} onClick={() => handleSort('totalSalesAmount')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Total Sales
                    {getSortIcon('totalSalesAmount')}
                  </div>
                </th>
                
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-color, #e2e8f0)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap'
                }} onClick={() => handleSort('profit')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Profit / Loss
                    {getSortIcon('profit')}
                  </div>
                </th>
                
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-color, #e2e8f0)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  whiteSpace: 'nowrap'
                }} onClick={() => handleSort('marginPercent')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Margin %
                    {getSortIcon('marginPercent')}
                  </div>
                </th>
                
                <th style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-muted, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderBottom: '1px solid var(--border-color, #e2e8f0)',
                  whiteSpace: 'nowrap'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            
            <tbody>
              {paginatedReport.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px',
                      color: 'var(--text-muted, #94a3b8)'
                    }}>
                      <FaSearch style={{ fontSize: '48px', opacity: 0.5 }} />
                      <p style={{ fontSize: '16px', fontWeight: '500' }}>
                        {loading ? 'Loading report data...' : 
                         searchKey ? `No results found for "${searchKey}"` : 
                         'No profit/loss data available'}
                      </p>
                      {searchKey && (
                        <button
                          onClick={() => setSearchKey("")}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: 'transparent',
                            border: '1px solid var(--border-color, #e2e8f0)',
                            borderRadius: 'var(--radius, 8px)',
                            color: 'var(--text-primary, #1e293b)',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedReport.map((row, index) => {
                  const isProfit = row.profit >= 0;
                  const profitStatus = getProfitStatus(row.profit);
                  
                  return (
                    <tr key={index} style={{
                      borderBottom: '1px solid var(--border-color, #f1f5f9)',
                      transition: 'background-color 0.2s'
                    }}>
                      <td style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: 'var(--text-primary, #1e293b)',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            backgroundColor: isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isProfit ? '#10b981' : '#ef4444'
                          }}>
                            {isProfit ? <FaShoppingCart /> : <FaInfoCircle />}
                          </div>
                          <div>
                            <div style={{
                              fontWeight: '500',
                              marginBottom: '4px'
                            }}>
                              {row.productName || 'Unnamed Product'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: 'var(--text-primary, #1e293b)',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <FaRupeeSign style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }} />
                          {formatCurrency(row.totalPurchaseAmount)}
                        </div>
                      </td>
                      
                      <td style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: 'var(--text-primary, #1e293b)',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: '600'
                        }}>
                          <FaRupeeSign style={{ fontSize: '12px', color: 'var(--text-muted, #94a3b8)' }} />
                          {formatCurrency(row.totalSalesAmount)}
                        </div>
                      </td>
                      
                      <td style={{
                        padding: '16px 20px',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          borderRadius: 'var(--radius, 8px)',
                          backgroundColor: profitStatus.bgColor,
                          color: profitStatus.color,
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          {profitStatus.icon}
                          <span>
                            {formatCurrency(Math.abs(row.profit))} {profitStatus.label}
                          </span>
                        </div>
                      </td>
                      
                      <td style={{
                        padding: '16px 20px',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          minWidth: '150px'
                        }}>
                          <div style={{
                            flex: 1,
                            height: '6px',
                            backgroundColor: 'var(--bg-secondary, #f1f5f9)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${Math.min(Math.abs(row.marginPercent || 0), 100)}%`,
                              height: '100%',
                              backgroundColor: profitStatus.color,
                              transition: 'width 0.3s'
                            }} />
                          </div>
                          <span style={{
                            color: profitStatus.color,
                            fontWeight: '600',
                            fontSize: '14px',
                            minWidth: '60px'
                          }}>
                            {Math.abs(row.marginPercent || 0).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      
                      <td style={{
                        padding: '16px 20px',
                        whiteSpace: 'nowrap'
                      }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm, 6px)',
                          backgroundColor: isProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: isProfit ? '#10b981' : '#ef4444',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {profitStatus.label}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredReport.length > 0 && (
          <div className="pagination" style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-color, #e2e8f0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div className="pagination-info" style={{
              fontSize: '14px',
              color: 'var(--text-muted, #64748b)'
            }}>
              Showing <strong>{(page - 1) * pageSize + 1}</strong> to{" "}
              <strong>{Math.min(page * pageSize, filteredReport.length)}</strong> of{" "}
              <strong>{filteredReport.length}</strong> items
            </div>

            <div className="pagination-controls" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                style={{
                  padding: '8px 16px',
                  backgroundColor: page === 1 ? 'var(--bg-secondary, #f1f5f9)' : 'var(--primary, #3b82f6)',
                  color: page === 1 ? 'var(--text-muted, #94a3b8)' : 'white',
                  border: 'none',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
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
                    onClick={() => handlePageChange(pageNumber)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: page === pageNumber ? 'var(--primary, #3b82f6)' : 'transparent',
                      color: page === pageNumber ? 'white' : 'var(--text-primary, #1e293b)',
                      border: `1px solid ${page === pageNumber ? 'var(--primary, #3b82f6)' : 'var(--border-color, #e2e8f0)'}`,
                      borderRadius: 'var(--radius, 6px)',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minWidth: '40px'
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                style={{
                  padding: '8px 16px',
                  backgroundColor: page === totalPages ? 'var(--bg-secondary, #f1f5f9)' : 'var(--primary, #3b82f6)',
                  color: page === totalPages ? 'var(--text-muted, #94a3b8)' : 'white',
                  border: 'none',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}