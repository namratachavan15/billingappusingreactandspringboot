import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiPackage, 
  FiUsers, 
  FiTruck,
  FiAlertCircle,
  FiDollarSign,
  FiShoppingCart,
  FiPieChart,
  FiCalendar,
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
  FiActivity,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import './Dashboard.css'
import { api } from "../Config/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const safe = (n) => (n ?? 0).toLocaleString();
  useEffect(() => {
    api
      .get("/api/owner/dashboard")
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Helper function for business health
  const calculateBusinessHealth = (data) => {
    if (!data) return "Loading...";
    
    const healthFactors = [];
    if (data.monthlyProfit >= 0) healthFactors.push('✓');
    if (data.lowStockCount === 0) healthFactors.push('✓');
    if (data.todaySales > 0) healthFactors.push('✓');
    
    if (healthFactors.length === 3) return 'Excellent';
    if (healthFactors.length === 2) return 'Good';
    if (healthFactors.length === 1) return 'Fair';
    return 'Needs Attention';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <FiAlertCircle size={48} />
          <h3>Failed to load dashboard data</h3>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }
  // SAFE DEFAULT ARRAYS
const lowStockProducts = data.lowStockProducts || [];
const recentSales = data.recentSales || [];
const recentPurchases = data.recentPurchases || [];
const sales7Days = data.sales7Days || [];
const sales6Months = data.sales6Months || [];

  // Prepare pie chart data for revenue distribution
  const revenueData = [
    { name: 'Sales', value: data.todaySales || 0, color: '#3b82f6' },
    { name: 'Purchase', value: data.todayPurchase || 0, color: '#8b5cf6' },
    { name: 'Profit', value: Math.abs(data.todayProfit) || 0, color: data.todayProfit >= 0 ? '#10b981' : '#ef4444' }
  ];

  // Prepare data for category distribution (if available)
  const categoryData = data.categoryDistribution || [
    { name: 'Electronics', value: 35 },
    { name: 'Clothing', value: 25 },
    { name: 'Home & Kitchen', value: 20 },
    { name: 'Others', value: 20 }
  ];

  return (
    <div className="dashboard1">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Business Dashboard</h1>
          <p>Welcome back! Here's what's happening with your business today.</p>
          <div className="date-indicator">
            <FiCalendar />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="refresh-btn">
            <FiActivity /> Refresh Data
          </button>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="stats-grid">
        <StatCard
          title="Today Sales"
          value={`₹${(data.todaySales || 0).toLocaleString()}`}
          icon={<FiDollarSign />}
          trend="+12%"
          positive={true}
          description="Compared to yesterday"
        />
        
        <StatCard
          title="Today Purchase"
          value={`₹${(data.todayPurchase ||0).toLocaleString()}`}
          icon={<FiShoppingCart />}
          trend="+8%"
          positive={true}
          description="Compared to yesterday"
        />
        
        <StatCard
          title="Today Profit/Loss"
          value={`₹${safe(Math.abs(data.todayProfit ?? 0))}`}
          icon={data.todayProfit >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          trend={data.todayProfit >= 0 ? "+15%" : "-5%"}
          profit={data.todayProfit >= 0}
          description="Net profit/loss today"
        />
        
        <StatCard
          title="Monthly Sales"
        value={`₹${safe(data.monthlySales)}`}
          icon={<FiDollarSign />}
          trend="+18%"
          positive={true}
          description="This month's total sales"
        />
        
        <StatCard
          title="Monthly Purchase"
        value={`₹${safe(data.monthlyPurchase)}`}
          icon={<FiShoppingCart />}
          trend="+10%"
          positive={true}
          description="This month's total purchases"
        />
        
        <StatCard
          title="Monthly Profit/Loss"
         value={`₹${safe(Math.abs(data.monthlyProfit ?? 0))}`}
          icon={data.monthlyProfit >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          trend={data.monthlyProfit >= 0 ? "+22%" : "-8%"}
          profit={data.monthlyProfit >= 0}
          description="Net profit/loss this month"
        />
        
        <StatCard
          title="Total Products"
         value={safe(data.totalProducts)}
          icon={<FiPackage />}
          trend="+5%"
          positive={true}
          description="Active products in inventory"
        />
        
        <StatCard
          title="Total Customers"
         value={safe(data.totalCustomers)}
          icon={<FiUsers />}
          trend="+15%"
          positive={true}
          description="Registered customers"
        />
        
        <StatCard
          title="Total Suppliers"
         value={safe(data.totalSuppliers)}
          icon={<FiTruck />}
          trend="+3%"
          positive={true}
          description="Active suppliers"
        />
        
        <StatCard
          title="Low Stock Items"
        value={safe(data.lowStockCount)}
          icon={<FiAlertCircle />}
          trend="Alert"
          positive={false}
          alert={true}
          description="Items requiring restock"
        />
      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="charts-section">
        <div className="section-header">
          <h2>Sales Analytics</h2>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-dot legend-sales"></div>
              <span>Sales</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot legend-profit"></div>
              <span>Profit</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot legend-purchase"></div>
              <span>Purchase</span>
            </div>
          </div>
        </div>

        <div className="chart-grid">
          {/* 7 Days Sales Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>Last 7 Days Sales Trend</h3>
              <select className="time-selector">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sales7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Sales']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 6 Months Sales Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>Last 6 Months Sales</h3>
              <select className="time-selector">
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sales6Months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Sales']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="total" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Distribution Pie Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <h3>Today's Revenue Distribution</h3>
            </div>
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹${value}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
             
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLES SECTION ================= */}
      <div className="tables-section">
        <div className="section-header">
          <h2>Quick Overview</h2>
         
        </div>

        <div className="tables-grid">
          {/* Low Stock Products */}
          <div className="table-container">
            <div className="table-header">
              <h3>Low Stock Products</h3>
              <a href="/stock" className="view-all">
                View All <FiChevronRight />
              </a>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Current Stock</th>
                    <th>Min. Required</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.slice(0, 5).map((product, index) => (
                    <tr key={index}>
                      <td className="product-name">{product.product?.pName || 'N/A'}</td>
                      <td className="stock-quantity">{product.quantity}</td>
                      <td className="min-required">{product.minStock || 10}</td>
                      <td>
                        <span className={`status-badge ${product.quantity <= 5 ? 'status-critical' : 'status-low'}`}>
                          {product.quantity <= 5 ? 'Critical' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="table-container">
            <div className="table-header">
              <h3>Recent Sales</h3>
              <a href="/sales" className="view-all">
                View All <FiChevronRight />
              </a>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bill No</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.slice(0, 5).map((sale, index) => (
                    <tr key={index}>
                      <td className="bill-no">#{sale.billNo}</td>
                      <td className="customer-name">{sale.customer?.name || 'Walk-in Customer'}</td>
                      <td className="sale-date">{new Date(sale.createdAt).toLocaleDateString()}</td>
                      <td className="amount positive">₹{sale.totalAmt.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="table-container">
            <div className="table-header">
              <h3>Recent Purchases</h3>
              <a href="/purchase" className="view-all">
                View All <FiChevronRight />
              </a>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Invoice No</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPurchases.slice(0, 5).map((purchase, index) => (
                    <tr key={index}>
                      <td className="supplier-name">{purchase.supplier?.supName || 'N/A'}</td>
                      <td className="invoice-no">#{purchase.invoiceNo || 'N/A'}</td>
                      <td className="purchase-date">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                      <td className="amount negative">₹{purchase.totalAmt.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="summary-grid">
        <div className="summary-card performance">
          <div className="summary-icon">
            {data.monthlyProfit >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
          </div>
          <div className="summary-content">
            <h4>Monthly Performance</h4>
            <div className="summary-value">
  {data.monthlyProfit >= 0 
    ? `+₹${safe(data.monthlyProfit)}`
    : `-₹${safe(Math.abs(data.monthlyProfit ?? 0))}`
  }
</div>
            <div className="summary-footer">
              {data.monthlyProfit >= 0 ? <FiArrowUp /> : <FiArrowDown />}
              <span>
                {data.monthlyProfit >= 0 
                  ? `Profit Margin: ${data.monthlySales > 0 ? Math.round((data.monthlyProfit / data.monthlySales) * 100) : 0}%`
                  : 'Operating at Loss'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card inventory">
          <div className="summary-icon">
            <FiPackage />
          </div>
          <div className="summary-content">
            <h4>Inventory Status</h4>
            <div className="summary-value">
  {safe(data.totalProducts)}
</div>
            <div className="summary-footer">
              <FiPackage />
              <span>
                {data.lowStockCount === 0 
                  ? 'All products in stock'
                  : `${data.lowStockCount} items need attention`
                }
              </span>
            </div>
          </div>
          {data.lowStockCount > 0 && (
            <div className="inventory-alert">
              <FiAlertCircle />
              <span>Action Required</span>
            </div>
          )}
        </div>

        <div className="summary-card health">
          <div className="summary-icon">
            <FiActivity />
          </div>
          <div className="summary-content">
            <h4>Business Health</h4>
            <div className="summary-value">
              {calculateBusinessHealth(data)}
            </div>
            <div className="summary-footer">
              {calculateBusinessHealth(data) === 'Excellent' ? <FiCheckCircle /> : <FiAlertCircle />}
              <span>
                {calculateBusinessHealth(data) === 'Excellent' 
                  ? 'All systems optimal'
                  : 'Review recommended'
                }
              </span>
            </div>
          </div>
          <div className="health-indicators">
            <div className={`indicator ${data.monthlyProfit >= 0 ? 'positive' : 'negative'}`}>
              {data.monthlyProfit >= 0 ? <FiCheckCircle /> : <FiXCircle />}
              <span>Profitability</span>
            </div>
            <div className={`indicator ${data.lowStockCount === 0 ? 'positive' : 'negative'}`}>
              {data.lowStockCount === 0 ? <FiCheckCircle /> : <FiXCircle />}
              <span>Inventory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD COMPONENT ================= */
function StatCard({ title, value, icon, trend, positive, profit, alert, description }) {
  return (
    <div className={`stat-card ${profit ? 'profit' : profit === false ? 'loss' : ''} ${alert ? 'alert' : ''}`}>
      <div className="stat-header">
        <div className="stat-title">{title}</div>
        <div className="stat-icon">{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-change">
        <span className={`trend ${positive ? 'change-positive' : 'change-negative'}`}>
          {trend}
        </span>
        <span className="stat-trend">vs last period</span>
      </div>
      {description && <div className="stat-description">{description}</div>}
    </div>
  );
}