import { useState, useEffect } from "react";
import { FaCalendarDay, FaCalendarAlt, FaBox, FaTruck, FaFileInvoice } from "react-icons/fa";
import DailyPurchaseReport from "./DailyPurchaseReport";
import ProductWisePurchaseReport from "./ProductWisePurchaseReport";
import MonthlyPurchaseReport from "./MonthlyPurchaseReport";
import SupplierWisePurchaseReport from "./SupplierWisePurchaseReport";
import "./SalesReportPage.css";
import { usePurchaseReport } from "../States/PurchaseReportContext";

export default function PurchaseReportPage() {
  const [activeTab, setActiveTab] = useState("daily");
  const { setActiveReport, clearReportData } = usePurchaseReport();

  const tabs = [
    { id: "daily", label: "Daily Report", icon: <FaCalendarDay /> },
    { id: "monthly", label: "Monthly Report", icon: <FaCalendarAlt /> },
    { id: "product", label: "Product-wise", icon: <FaBox /> },
    { id: "supplier", label: "Supplier-wise", icon: <FaTruck /> },
  ];

  const handleTabChange = (tabId) => {
    // Clear previous tab data
    clearReportData(tabId);
    
    // Set new active tab
    setActiveTab(tabId);
    setActiveReport(tabId);
  };

  return (
    <div className="sale-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Purchase Reports</h1>
        <p>Analyze and track your purchase transactions and supplier activities</p>
      </div>

      {/* Tabs Card */}
      <div className="form-card">
        <div className="form-card-header">
          <h3>Report Types</h3>
        </div>

        <div className="form-card-body">
          <div className="report-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="table-card">
        <div className="table-header">
          <h3>
            {tabs.find(t => t.id === activeTab)?.icon}
            {" "}
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
        </div>

        <div className="report-content">
          {activeTab === "daily" && <DailyPurchaseReport />}
          {activeTab === "monthly" && <MonthlyPurchaseReport />}
          {activeTab === "product" && <ProductWisePurchaseReport />}
          {activeTab === "supplier" && <SupplierWisePurchaseReport />}
        </div>
      </div>
    </div>
  );
}