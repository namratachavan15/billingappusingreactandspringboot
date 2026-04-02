import { createContext, useContext, useState } from "react";
import { api } from "../Config/api";

const PurchaseReportContext = createContext();

export const PurchaseReportProvider = ({ children }) => {
  const [dailyRows, setDailyRows] = useState([]);
  const [monthlyRows, setMonthlyRows] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [supplierRows, setSupplierRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState(null);

  // Helper function to normalize data
  const normalizeData = (data) => {
    return Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
      ? data.data
      : [];
  };

  // Generic fetch with report type tracking
  const fetchReport = async (url, reportType, setRows) => {
    try {
      setLoading(true);
      setActiveReport(reportType);
      
      const res = await api.get(url);
      
      // 🔒 Normalize response
      const data = normalizeData(res.data);
      
      setRows(data);
      console.log(`${reportType} data:`, data);
    } catch (err) {
      console.error(`Failed to fetch ${reportType} report:`, err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear all data
  const clearData = () => {
    setDailyRows([]);
    setMonthlyRows([]);
    setProductRows([]);
    setSupplierRows([]);
    setActiveReport(null);
  };

  // Clear specific report data
  const clearReportData = (reportType) => {
    switch(reportType) {
      case 'daily': setDailyRows([]); break;
      case 'monthly': setMonthlyRows([]); break;
      case 'product': setProductRows([]); break;
      case 'supplier': setSupplierRows([]); break;
      default: clearData();
    }
  };

  // Get current rows based on active report
  const getCurrentRows = () => {
    switch(activeReport) {
      case 'daily': return dailyRows;
      case 'monthly': return monthlyRows;
      case 'product': return productRows;
      case 'supplier': return supplierRows;
      default: return [];
    }
  };

  // Daily Report
  const loadDaily = async ({ fromDate, toDate }) => {
    await fetchReport(
      `/api/purchase-reports/daily?fromDate=${fromDate}&toDate=${toDate}`,
      'daily',
      setDailyRows
    );
  };

  // Monthly Report
  const loadMonthly = async ({ fromDate, toDate }) => {
    await fetchReport(
      `/api/purchase-reports/monthly?fromDate=${fromDate}&toDate=${toDate}`,
      'monthly',
      setMonthlyRows
    );
  };

  // Product-wise Report
  const loadProductWise = async ({ fromDate, toDate }) => {
    await fetchReport(
      `/api/purchase-reports/product-wise?fromDate=${fromDate}&toDate=${toDate}`,
      'product',
      setProductRows
    );
  };

  // Supplier-wise Report
  const loadSupplierWise = async ({ fromDate, toDate }) => {
    await fetchReport(
      `/api/purchase-reports/supplier-wise?fromDate=${fromDate}&toDate=${toDate}`,
      'supplier',
      setSupplierRows
    );
  };

  return (
    <PurchaseReportContext.Provider value={{
      // Individual rows for each report type
      dailyRows,
      monthlyRows,
      productRows,
      supplierRows,
      
      // Current rows based on active report
      rows: getCurrentRows(),
      activeReport,
      loading,
      
      // Functions
      loadDaily,
      loadMonthly,
      loadProductWise,
      loadSupplierWise,
      clearData,
      clearReportData,
      setActiveReport
    }}>
      {children}
    </PurchaseReportContext.Provider>
  );
};

export const usePurchaseReport = () => useContext(PurchaseReportContext);