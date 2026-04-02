import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './assets/Components/States/AuthContext';
import './App.css'
// Pages
import Login from './assets/Components/Pages/Login';
import AppLayout from './assets/Components/AppLayout';
import Dashboard from './assets/Components/Pages/Dashboard';
import AddShop from './assets/Components/Pages/AddShop';
import AddMasterCategory from './assets/Components/Pages/AddMasterCategory';
import AddMainCategory from './assets/Components/Pages/AddMainCategory';
import AddSubCategory from './assets/Components/Pages/AddSubCategory';
import AddCustomer from './assets/Components/Pages/AddCustomer';
import AddEmployee from './assets/Components/Pages/AddEmployee';
import AddSupplier from './assets/Components/Pages/AddSupplier';
import AddPurchase from './assets/Components/Pages/AddPurchase';
import ProductMaster from './assets/Components/Pages/ProductMaster';
import AddSale from './assets/Components/Pages/AddSale';
import StockPage from './assets/Components/Pages/StockPage';
import SalesReportPage from './assets/Components/Pages/SalesReportPage';
import PurchaseReportPage from './assets/Components/Pages/PurchaseReportPage';
import ProtectedRoute from './assets/Components/ProtectedRoute';

import PrintBill from './assets/Components/Pages/PrintBill';
import ShopOwnerDashboard from './assets/Components/Pages/Dashboard';
import OwnerDashboard from './assets/Components/Pages/Dashboard';
import AdminDashboard from './assets/Components/Pages/AdminDashboard';
import ProfitLossReport from './assets/Components/Pages/ProfitLossReport';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

          {/* Dashboard */}
          {/* <Route index element={<Dashboard />} /> */}
          <Route index element={
  <ProtectedRoute>
    {user?.role === "ADMIN" ? <AdminDashboard /> : <Dashboard />}
  </ProtectedRoute>
} />

          {/* ADMIN ONLY */}
          <Route path="shop-registration" element={
            <ProtectedRoute roles={['ADMIN']}><AddShop /></ProtectedRoute>
          } />
          <Route path="master-category" element={
            <ProtectedRoute roles={['OWNER']}><AddMasterCategory /></ProtectedRoute>
          } />
          <Route path="main-category" element={
            <ProtectedRoute roles={['OWNER']}><AddMainCategory /></ProtectedRoute>
          } />
          <Route path="sub-category" element={
            <ProtectedRoute roles={['OWNER']}><AddSubCategory /></ProtectedRoute>
          } />
          <Route path="employees" element={
            <ProtectedRoute roles={['OWNER']}><AddEmployee /></ProtectedRoute>
          } />

          {/* OWNER ONLY */}
          <Route path="owner/complete-shop/:shopId" element={
            <ProtectedRoute roles={['OWNER']}><AddShop /></ProtectedRoute>
          } />

          {/* ADMIN + OWNER SHARED */}
          <Route path="customers" element={
            <ProtectedRoute roles={['OWNER']}><AddCustomer /></ProtectedRoute>
          } />
          <Route path="supplier" element={
            <ProtectedRoute roles={['OWNER']}><AddSupplier /></ProtectedRoute>
          } />
          <Route path="purchase" element={
            <ProtectedRoute roles={['OWNER']}><AddPurchase /></ProtectedRoute>
          } />
          <Route path="product" element={
            <ProtectedRoute roles={['OWNER']}><ProductMaster /></ProtectedRoute>
          } />
          <Route path="sales" element={
            <ProtectedRoute roles={['OWNER']}><AddSale /></ProtectedRoute>
          } />
          <Route path="stock" element={
            <ProtectedRoute roles={['OWNER']}><StockPage /></ProtectedRoute>
          } />

<Route path="print-bill/:saleId" element={<ProtectedRoute roles={['OWNER']}><PrintBill /></ProtectedRoute>} />

<Route path="/print-bill/scan/:billNo" element={<ProtectedRoute roles={['OWNER']}><PrintBill /></ProtectedRoute>} />
          {/* REPORTS */}
          <Route path="reports/sales" element={
            <ProtectedRoute roles={['OWNER','STAFF']}><SalesReportPage /></ProtectedRoute>
          } />
          <Route path="reports/purchase" element={
            <ProtectedRoute roles={['OWNER','STAFF']}><PurchaseReportPage /></ProtectedRoute>
          } />

<Route path="reports/profit-loss" element={
            <ProtectedRoute roles={['OWNER','STAFF']}><ProfitLossReport /></ProtectedRoute>
          } />

          {/* REDIRECT UNKNOWN */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
