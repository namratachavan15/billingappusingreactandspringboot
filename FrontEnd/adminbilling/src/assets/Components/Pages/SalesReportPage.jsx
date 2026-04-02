import { useState } from "react";
import { FaCalendarDay, FaCalendarAlt, FaBox, FaUser } from "react-icons/fa";
import DailySalesReport from "./DailySalesReport";
import ProductWiseSalesReport from "./ProductWiseSalesReport";
import MonthlySalesReport from "./MonthlySalesReport";
import CustomerWiseSalesReport from "./CustomerWiseSalesReport";
import './SalesReportPage.css';

export default function SalesReportPage() {
  const [activeTab, setActiveTab] = useState("daily");

  const tabs = [
    { id: "daily", label: "Daily Report", icon: <FaCalendarDay /> },
    { id: "monthly", label: "Monthly Report", icon: <FaCalendarAlt /> },
    { id: "product", label: "Product-wise", icon: <FaBox /> },
    { id: "customer", label: "Customer-wise", icon: <FaUser /> },
  ];

  return (
    <div className="sale-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>Sales Reports</h1>
        <p>Generate and analyze sales reports with comprehensive insights</p>
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
                onClick={() => setActiveTab(tab.id)}
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
          {activeTab === "daily" && <DailySalesReport />}
          {activeTab === "monthly" && <MonthlySalesReport />}
          {activeTab === "product" && <ProductWiseSalesReport />}
          {activeTab === "customer" && <CustomerWiseSalesReport />}
        </div>
      </div>
    </div>
  );
}