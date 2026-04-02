import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  CartesianGrid, XAxis, YAxis, Tooltip
} from "recharts";
import { api } from "../Config/api";
import {
  FaStore, FaShoppingCart, FaMoneyBillWave, FaChartLine,
  FaUsers, FaBox, FaTruck, FaFilter, FaArrowUp, FaArrowDown,
  FaEye, FaShoppingBag, FaWarehouse, FaUserCheck, FaExchangeAlt
} from "react-icons/fa";
import "./AdminDashboard.css";

import { Link } from "react-router-dom";


export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [selectedShop, setSelectedShop] = useState("all");
  const [chartData, setChartData] = useState([]);
  const [topShopsData, setTopShopsData] = useState([]);
  const [recentSalesData, setRecentSalesData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [recentPurchasesData, setRecentPurchasesData] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("week");

  useEffect(() => {
    setLoading(true);
    api.get("/api/admin/dashboard")
      .then(res => {
        setData(res.data);

        // Generate unique shop names for dropdown
        const shops = [
          ...new Set((res.data.topShopsBySales || []).map(shop => shop.shopName))
        ];
        setShopList(shops);

        // Initialize states with combined/all data
        setChartData(res.data.salesPurchaseByShop?.all || []);
        setTopShopsData(res.data.topShopsBySales?.slice(0, 5) || []);
        setRecentSalesData(res.data.recentSalesByShop?.slice(0, 5) || []);
        setLowStockData(res.data.lowStockByShop?.slice(0, 5) || []);
        setRecentPurchasesData(res.data.recentPurchasesByShop?.slice(0, 5) || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Update all data whenever selectedShop changes
 useEffect(() => {
  if (!data) return;

  const chart = data.salesPurchaseByShop || {};
  const topShops = data?.topShopsBySales || [];
  const recentSales = data?.recentSalesByShop || [];
  const lowStock = data?.lowStockByShop || [];
  const purchases = data?.recentPurchasesByShop || [];

  setChartData(
    selectedShop === "all"
      ? chart["all"] || []
      : chart[selectedShop] || []
  );

  setTopShopsData(
    selectedShop === "all"
      ? topShops.slice(0, 5)
      : topShops.filter(s => s.shopName === selectedShop)
  );

  setRecentSalesData(
    selectedShop === "all"
      ? recentSales.slice(0, 5)
      : recentSales.filter(s => s.shopName === selectedShop)
  );

  setLowStockData(
    selectedShop === "all"
      ? lowStock.slice(0, 5)
      : lowStock.filter(s => s.shopName === selectedShop)
  );

  setRecentPurchasesData(
    selectedShop === "all"
      ? purchases.slice(0, 5)
      : purchases.filter(s => s.shopName === selectedShop)
  );

}, [selectedShop, data]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const getRandomColor = () => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#8B5CF6'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const timeFilters = [
    { label: "Today", value: "day" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <h3>Loading Dashboard...</h3>
      </div>
    );
  }

  // Prepare Pie chart data for top shops
  const shopPerformanceData = topShopsData.map(shop => ({
    name: shop.shopName.length > 10 ? shop.shopName.substring(0, 10) + '...' : shop.shopName,
    value: shop.totalSales,
    color: getRandomColor()
  }));

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            <FaChartLine /> Admin Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Overview of all shops performance and analytics
          </p>
        </div>

        <div className="dashboard-filters">

          <Link to="/shop-registration" className="btn btn-primary">
    <FaStore /> Register Shop
  </Link>
          <div className="filter-group">
            <FaFilter />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="filter-select"
            >
              {timeFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <FaStore />
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Shops</option>
              {shopList.map((shopName, i) => (
                <option key={i} value={shopName}>{shopName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(
            selectedShop === "all"
              ? data.monthlySales
              : topShopsData.reduce((sum, s) => sum + s.totalSales, 0)
          )}
          icon={<FaMoneyBillWave />}
          trend={calculateGrowth(
            selectedShop === "all" ? data.todaySales : topShopsData[0]?.todaySales || 0,
            selectedShop === "all" ? data.yesterdaySales : topShopsData[0]?.previousSales || 0
          )}
          color="linear-gradient(135deg, #10B981, #059669)"
        />

        <SummaryCard
          title="Total Profit"
          value={formatCurrency(
            selectedShop === "all"
              ? data.monthlyProfit
              : topShopsData.reduce((sum, s) => sum + s.totalProfit, 0)
          )}
          icon={<FaChartLine />}
          trend={calculateGrowth(
            selectedShop === "all" ? data.todayProfit : topShopsData[0]?.todayProfit || 0,
            selectedShop === "all" ? data.yesterdayProfit : topShopsData[0]?.previousProfit || 0
          )}
          color="linear-gradient(135deg, #3B82F6, #2563EB)"
        />

        <SummaryCard
          title="Total Purchase"
          value={formatCurrency(
            selectedShop === "all"
              ? data.monthlyPurchase
              : recentPurchasesData.reduce((sum, p) => sum + p.totalAmount, 0)
          )}
          icon={<FaShoppingCart />}
          trend={-5.2}
          color="linear-gradient(135deg, #8B5CF6, #7C3AED)"
        />

        <SummaryCard
          title="Active Shops"
          value={selectedShop === "all" ? data.totalShops : 1}
          icon={<FaStore />}
          trend={2.5}
          color="linear-gradient(135deg, #F59E0B, #D97706)"
        />

        <SummaryCard
          title="Total Products"
          value={selectedShop === "all" ? data.totalProducts : lowStockData.length}
          icon={<FaBox />}
          trend={8.7}
          color="linear-gradient(135deg, #EC4899, #DB2777)"
        />

        <SummaryCard
          title="Total Customers"
          value={selectedShop === "all" ? data.totalCustomers : recentSalesData.length}
          icon={<FaUsers />}
          trend={12.3}
          color="linear-gradient(135deg, #14B8A6, #0D9488)"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3><FaExchangeAlt /> Sales vs Purchase Trend</h3>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                <Area type="monotone" dataKey="sales" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="purchase" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3><FaStore /> Top Performing Shops</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={shopPerformanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {shopPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="tables-grid">
        <DataTable
          title="Top Shops by Sales"
          icon={<FaMoneyBillWave />}
          headers={["Shop", "Sales", "Growth"]}
          data={topShopsData.map(shop => ({
            shop: shop.shopName,
            sales: formatCurrency(shop.totalSales),
            growth: calculateGrowth(shop.totalSales, shop.previousSales || 0)
          }))}
        />

        <DataTable
          title="Recent Sales"
          icon={<FaShoppingBag />}
          headers={["Shop", "Bill No", "Amount", "Status"]}
          data={recentSalesData.map(sale => ({
            shop: sale.shopName,
            bill: sale.billNo,
            amount: formatCurrency(sale.totalAmount),
            status: "Completed"
          }))}
        />

        <DataTable
          title="Low Stock Items"
          icon={<FaWarehouse />}
          headers={["Shop", "Product", "Stock", "Status"]}
          data={lowStockData.map(item => ({
            shop: item.shopName,
            product: item.productName.length > 20 ? item.productName.substring(0, 20) + '...' : item.productName,
            stock: item.quantity,
            status: item.quantity === 0 ? "Out of Stock" : "Low Stock"
          }))}
        />

        <DataTable
          title="Recent Purchases"
          icon={<FaTruck />}
          headers={["Shop", "Supplier", "Amount", "Date"]}
          data={recentPurchasesData.map(purchase => ({
            shop: purchase.shopName,
            supplier: purchase.supplierName,
            amount: formatCurrency(purchase.totalAmount),
            date: new Date(purchase.date).toLocaleDateString()
          }))}
        />
      </div>
    </div>
  );
}

// ---------------- Helper Components ----------------
function SummaryCard({ title, value, icon, trend, color }) {
  const isNegative = trend < 0;
  return (
    <div className="summary-card">
      <div className="card-accent" style={{ background: color }}></div>
      <div className="card-header">
        <div>
          <p className="card-title">{title}</p>
          <h3 className="card-value">{value}</h3>
        </div>
        <div className="card-icon" style={{ background: `${color}20`, color }}>{icon}</div>
      </div>
      {trend !== undefined && (
        <div className={`trend-indicator ${isNegative ? 'negative' : 'positive'}`}>
          {isNegative ? <FaArrowDown /> : <FaArrowUp />}
          <span>{Math.abs(trend).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

function DataTable({ title, icon, headers, data }) {
  return (
    <div className="data-table-card">
      <div className="table-header">
        <div className="table-icon">{icon}</div>
        <h3 className="table-title">{title}</h3>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={headers.length} className="empty-data">No data available</td></tr>
            ) : data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <div className="table-footer">
          <button className="view-all-btn"><FaEye /> View All</button>
        </div>
      )}
    </div>
  );
}
