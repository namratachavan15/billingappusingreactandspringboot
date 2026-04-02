// AppLayout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "./States/AuthContext";
import "./AppLayout.css";

const AppLayout = () => {
  const { user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);   // desktop collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile slide

  const isAdmin = user?.role === "ADMIN";
  const isOwner = user?.role === "OWNER";   // ✅ added

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      // MOBILE: open/close sidebar
      setIsMobileOpen((prev) => !prev);
    } else {
      // DESKTOP: collapse/expand width
      setIsCollapsed((prev) => !prev);
    }
  };

  // Close mobile sidebar when resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className={`app-wrapper 
        ${isCollapsed ? "collapsed" : ""} 
        ${isAdmin ? "admin-no-sidebar" : ""} 
        ${isOwner ? "owner-full-header" : ""}   /* ✅ added */
      `}
    >
      {/* Mobile backdrop only if sidebar exists */}
      {isMobileOpen && !isAdmin && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Header toggleSidebar={handleToggleSidebar} />

      {/* ✅ Sidebar hidden for ADMIN only (unchanged logic) */}
      {!isAdmin && (
        <Sidebar
          isCollapsed={isCollapsed}
          isMobileOpen={isMobileOpen}
          closeMobile={() => setIsMobileOpen(false)}
        />
      )}

      <main className="app-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default AppLayout;
