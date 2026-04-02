import { Link, useLocation } from "react-router-dom";
import {
  FaGaugeHigh,
  FaStore,
  FaLayerGroup,
  FaTags,
  FaUsers,
  FaUserTie,
  FaBoxOpen,
  FaTruckFast,
  FaCartArrowDown,
  FaFileInvoiceDollar,
  FaChartLine,
  FaChevronUp,
  FaChevronDown,
  FaWarehouse
} from "react-icons/fa6";
import {

 
  FaSitemap
} from "react-icons/fa6";

import { useAuth } from "./States/AuthContext";
import { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ isCollapsed, isMobileOpen, closeMobile }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [openCategory, setOpenCategory] = useState(false);
  const [openReports, setOpenReports] = useState(false);

  const isActiveLink = (path) => location.pathname === path;
  if (!user) return null;

  return (
    <aside className={`mm-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "show" : ""}`}>
      
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-text">
          {!isCollapsed && <h3>Billing System</h3>}
          {!isCollapsed && <p>Manage Your Business</p>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {!isCollapsed && <div className="nav-section-title">MAIN MENU</div>}

        <ul className="sidebar-menu">

          {/* Dashboard */}
          <li>
            <Link to="/" className={`sidebar-link ${isActiveLink("/") ? "active" : ""}`} onClick={closeMobile}>
              <div className="link-content">
                <FaGaugeHigh className="sidebar-icon" />
                {!isCollapsed && <span className="link-text">Dashboard</span>}
              </div>
            </Link>
          </li>

          {/* ADMIN */}
          {user.role === "ADMIN" && (
            <li>
              <Link to="/shop-registration" className={`sidebar-link ${isActiveLink("/shop-registration") ? "active" : ""}`} onClick={closeMobile}>
                <div className="link-content">
                  <FaStore className="sidebar-icon" />
                  {!isCollapsed && <span className="link-text">Shop Registration</span>}
                </div>
              </Link>
            </li>
          )}

          {/* OWNER */}
          {user.role === "OWNER" && (
            <>
              <li>
                <Link to={`/owner/complete-shop/${user.shopId}`} className={`sidebar-link ${isActiveLink(`/owner/complete-shop/${user.shopId}`) ? "active" : ""}`} onClick={closeMobile}>
                  <div className="link-content">
                    <FaStore className="sidebar-icon" />
                    {!isCollapsed && <span className="link-text">Complete Shop Profile</span>}
                  </div>
                </Link>
              </li>

              {/* CATEGORY */}
              <li className="sidebar-dropdown">
                <button className="sidebar-link" onClick={() => setOpenCategory(!openCategory)}>
                  <div className="link-content">
                    <FaLayerGroup className="sidebar-icon" />
                    {!isCollapsed && <span className="link-text">Category Master</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="dropdown-arrow-container">
                      {openCategory ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  )}
                </button>

                {openCategory && (
  <ul className="sidebar-submenu">
    <li>
      <Link
        to="/master-category"
        className={`submenu-link ${isActiveLink("/master-category") ? "active" : ""}`}
        onClick={closeMobile}
      >
        <FaTags className="submenu-icon" />
        Master Category
      </Link>
    </li>

    <li>
      <Link
        to="/main-category"
        className={`submenu-link ${isActiveLink("/main-category") ? "active" : ""}`}
        onClick={closeMobile}
      >
        <FaLayerGroup className="submenu-icon" />
        Main Category
      </Link>
    </li>

    <li>
      <Link
        to="/sub-category"
        className={`submenu-link ${isActiveLink("/sub-category") ? "active" : ""}`}
        onClick={closeMobile}
      >
        <FaSitemap className="submenu-icon" />
        Sub Category
      </Link>
    </li>
  </ul>
)}

              </li>

              <li><Link to="/employees" className={`sidebar-link ${isActiveLink("/employees") ? "active" : ""}`} onClick={closeMobile}><div className="link-content"><FaUserTie className="sidebar-icon" /> {!isCollapsed && <span className="link-text">Employee Registration</span>}</div></Link></li>

              <li><Link to="/customers" className={`sidebar-link ${isActiveLink("/customers") ? "active" : ""}`} onClick={closeMobile}><div className="link-content"><FaUsers className="sidebar-icon" /> {!isCollapsed && <span className="link-text">Customer Registration</span>}</div></Link></li>

              <li><Link to="/supplier" className={`sidebar-link ${isActiveLink("/supplier") ? "active" : ""}`} onClick={closeMobile}><div className="link-content"><FaTruckFast className="sidebar-icon" /> {!isCollapsed && <span className="link-text">Supplier</span>}</div></Link></li>

              <li><Link to="/product" className={`sidebar-link ${isActiveLink("/product") ? "active" : ""}`} onClick={closeMobile}><div className="link-content"><FaBoxOpen className="sidebar-icon" /> {!isCollapsed && <span className="link-text">Product Master</span>}</div></Link></li>


              <li><Link to="/purchase" className={`sidebar-link ${isActiveLink("/purchase") ? "active" : ""}`} onClick={closeMobile}><div className="link-content"><FaCartArrowDown className="sidebar-icon" /> {!isCollapsed && <span className="link-text">Purchase</span>}</div></Link></li>

              
              <li><Link to="/sales" className={`sidebar-link ${isActiveLink("/sales") ? "active" : ""}`} onClick={closeMobile}><div className="link-content"><FaFileInvoiceDollar className="sidebar-icon" /> {!isCollapsed && <span className="link-text">Sales</span>}</div></Link></li>

              <li><Link to="/stock" className={`sidebar-link ${isActiveLink("/stock") ? "active" : ""}`} onClick={closeMobile}><div className="link-content"><FaWarehouse className="sidebar-icon" /> {!isCollapsed && <span className="link-text">Stock Management</span>}</div></Link></li>

              {/* REPORTS */}
              <li className="sidebar-dropdown">
                <button className="sidebar-link" onClick={() => setOpenReports(!openReports)}>
                  <div className="link-content">
                    <FaChartLine className="sidebar-icon" />
                    {!isCollapsed && <span className="link-text">Reports</span>}
                  </div>
                  {!isCollapsed && <div className="dropdown-arrow-container">{openReports ? <FaChevronUp /> : <FaChevronDown />}</div>}
                </button>

                {openReports && (
  <ul className="sidebar-submenu">
    <li>
      <Link
        to="/reports/sales"
        className={`submenu-link ${isActiveLink("/reports/sales") ? "active" : ""}`}
        onClick={closeMobile}
      >
        <FaChartLine className="submenu-icon" />
        Sales Report
      </Link>
    </li>

    <li>
      <Link
        to="/reports/purchase"
        className={`submenu-link ${isActiveLink("/reports/purchase") ? "active" : ""}`}
        onClick={closeMobile}
      >
        <FaCartArrowDown className="submenu-icon" />
        Purchase Report
      </Link>
    </li>

    <li>
      <Link
        to="/reports/profit-loss"
        className={`submenu-link ${isActiveLink("/reports/profit-loss") ? "active" : ""}`}
        onClick={closeMobile}
      >
        <FaFileInvoiceDollar className="submenu-icon" />
        Profit / Loss
      </Link>
    </li>
  </ul>
)}

              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
