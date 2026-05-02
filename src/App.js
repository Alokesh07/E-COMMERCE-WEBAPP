import { Routes, Route, Navigate } from "react-router-dom";

import LoginRegister from "./components/Auth/LoginRegister";
import ForgotPasswordForm from "./components/Auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/Auth/ResetPasswordForm";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";

import Shop from "./pages/Shop";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import CategoryManagement from "./pages/CategoryManagement";

function App() {
  return (
    <Routes>
{/* ================= AUTH ================= */}
      <Route path="/auth" element={<LoginRegister />} />
      {/* Backwards-compatible login route - redirect to /auth */}
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/add-product" element={<AddProduct />} />
      <Route path="/admin/categories" element={<CategoryManagement />} />

      {/* ================= MAIN LAYOUT (HEADER + SIDEBAR) ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* HOME / SHOP */}
        <Route index element={<Shop />} />

        {/* USER PROFILE */}
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* ================= STANDALONE PROTECTED PAGES (NO HEADER / SIDEBAR) ================= */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-tracking/:orderId"
        element={
          <ProtectedRoute>
            <OrderTracking />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
