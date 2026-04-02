import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  FaBars,
  FaChevronDown,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import { useAuth } from "./States/AuthContext";

export default function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log("user",user)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const displayName = (() => {
    if (!user) return "User";
    if (user.role === "ADMIN") return "Admin";
    if (user.shopName) return user.shopName;
    return user.role;
  })();

  /* ✅ ONLY ADMIN HIDES BUTTON */
  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="mm-header">
      <div className="header-left">

        {/* ✅ visible for OWNER + STAFF, hidden only for ADMIN */}
        {!isAdmin && (
          <button className="menu-toggle-btn" onClick={toggleSidebar}>
            <FaBars className="menu-icon" />
          </button>
        )}

        <div className="header-title">
          <h2>Billing Dashboard</h2>
          {/* <div className="title-underline"></div> */}
        </div>
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-menu-wrapper" ref={dropdownRef}>
            <button
              className={`user-trigger ${isDropdownOpen ? "active" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="user-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                <span className="user-name">{displayName}</span>
                <span className="user-role">{user?.role || "USER"}</span>
              </div>

              <FaChevronDown className="user-caret" />
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="dropdown-user-info">
                    <div className="dropdown-name">{displayName}</div>
                    <div className="dropdown-email">
                      {user?.employee?.email || user?.username}
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  type="button"
                  className="dropdown-item-btn logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="dropdown-item-icon" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            <FaUser className="btn-icon" />
            <span>Login</span>
          </button>
        )}
      </div>
    </header>
  );
}
