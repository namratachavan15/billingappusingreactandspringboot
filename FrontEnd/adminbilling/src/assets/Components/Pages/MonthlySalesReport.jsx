import { useState } from "react";
import { api } from "../Config/api";
import { FaCalendar, FaFileInvoice, FaCube, FaChartBar, FaRupeeSign, FaPercentage, FaCalendarAlt, FaPlay } from "react-icons/fa";

const MonthlySalesReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both dates");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get(
        `/api/reports/monthly-sales?fromDate=${fromDate}&toDate=${toDate}`
      );
      console.log("report",res.data)
      setRows(res.data);
    } catch (error) {
      console.error("Error fetching report", error);
      alert("Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  const totals = rows.reduce((a, r) => {
    a.sales += r.totalSales || 0;
    a.qty += r.totalQuantity || 0;
    a.taxable += r.taxableAmount || 0;
    a.cgst += r.cgstAmount || 0;
    a.sgst += r.sgstAmount || 0;
    a.gst += r.totalGst || 0;
    a.net += r.netAmount || 0;
    return a;
  }, { sales: 0, qty: 0, taxable: 0, cgst: 0, sgst: 0, gst: 0, net: 0 });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1] || "";
  };

  return (
    <div className="report-container">
      {/* Filter Controls */}
      <div className="report-controls">
        <div className="date-inputs">
          <div className="form-group">
            <label className="form-label">
              <FaCalendar /> From Date
            </label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              <FaCalendar /> To Date
            </label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={e => setToDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">&nbsp;</label>
            <button
              className="btn btn-primary"
              onClick={loadReport}
              disabled={loading || !fromDate || !toDate}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span> Loading...
                </>
              ) : (
                <>
                  <FaPlay /> Generate Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {rows.length > 0 && (
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <FaCalendarAlt />
              </div>
              <div className="stat-info">
                <div className="stat-label">Months</div>
                <div className="stat-value">{rows.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <FaFileInvoice />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Invoices</div>
                <div className="stat-value">{totals.sales}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                <FaCube />
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Quantity</div>
                <div className="stat-value">{totals.qty}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <FaRupeeSign />
              </div>
              <div className="stat-info">
                <div className="stat-label">Net Amount</div>
                <div className="stat-value">{formatCurrency(totals.net)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Table */}
      <div className="report-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th><FaCalendarAlt /> Year</th>
              <th><FaCalendarAlt /> Month</th>
              <th><FaFileInvoice /> Invoices</th>
              <th><FaCube /> Qty</th>
              <th><FaChartBar /> Taxable</th>
              <th><FaPercentage /> CGST</th>
              <th><FaPercentage /> SGST</th>
              <th><FaPercentage /> Total GST</th>
              <th><FaRupeeSign /> Net</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="9">
                  <div className="empty-state">
                    <FaCalendarAlt />
                    <p>{loading ? "Loading report..." : "Select dates and generate report"}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className="year-badge">{r.year}</span>
                  </td>
                  <td>
                    <strong>{getMonthName(r.month)}</strong>
                  </td>
                  <td>
                    <span className="id-badge">{r.totalSales}</span>
                  </td>
                  <td>
                    <span className="quantity-badge">{r.totalQuantity}</span>
                  </td>
                  <td>
                    <span className="amount">{formatCurrency(r.taxableAmount)}</span>
                  </td>
                  <td>
                    <span className="gst-badge cgst">
                      {formatCurrency(r.cgstAmount)}
                    </span>
                  </td>
                  <td>
                    <span className="gst-badge sgst">
                      {formatCurrency(r.sgstAmount)}
                    </span>
                  </td>
                  <td>
                    <span className="gst-badge total">
                      {formatCurrency(r.totalGst)}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--success)' }}>
                      {formatCurrency(r.netAmount)}
                    </strong>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          
          {rows.length > 0 && (
            <tfoot>
              <tr className="table-footer">
                <td colSpan="2"><strong>Total</strong></td>
                <td><strong>{totals.sales}</strong></td>
                <td><strong>{totals.qty}</strong></td>
                <td><strong>{formatCurrency(totals.taxable)}</strong></td>
                <td><strong>{formatCurrency(totals.cgst)}</strong></td>
                <td><strong>{formatCurrency(totals.sgst)}</strong></td>
                <td><strong>{formatCurrency(totals.gst)}</strong></td>
                <td><strong style={{ color: 'var(--success)' }}>{formatCurrency(totals.net)}</strong></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default MonthlySalesReport;