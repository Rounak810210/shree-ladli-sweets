import { Routes, Route, Navigate } from "react-router-dom";

import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Categories from "./components/Categories";
import BestSellers from "./components/BestSellers";
import Footer from "./components/Footer";

import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderConfirmation from "./pages/OrderConfirmation";
import Menu from "./pages/Menu";

import EditProduct from "./pages/admin/EditProduct";
import MyOrders from "./pages/MyOrders";

import AddProduct from "./pages/admin/AddProduct";
import AdminProducts from "./pages/admin/AdminProducts";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import SweetsAdmin from "./pages/admin/SweetsAdmin";
import FastFoodAdmin from "./pages/admin/FastFoodAdmin";
import SnacksAdmin from "./pages/admin/SnacksAdmin";
import BeveragesAdmin from "./pages/admin/BeveragesAdmin";
import Analytics from "./pages/admin/Analytics";
import OrderDetails from "./pages/admin/OrderDetails";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { CartProvider } from "./context/CartContext";


// =========================================================
// HOME PAGE
// =========================================================

function Home() {
  return (
    <>
      <Hero />
      <BestSellers />
      <About />
      <Categories />
      <Footer />
    </>
  );
}


// =========================================================
// GET LOGGED-IN ADMIN
// =========================================================

function getAdmin() {
  try {
    return JSON.parse(
      localStorage.getItem("shreeLadliAdmin")
    );
  } catch {
    return null;
  }
}




// =========================================================
// GET LOGGED-IN CUSTOMER
// =========================================================

function getCustomerToken() {
  return localStorage.getItem("customerToken");
}


// =========================================================
// CUSTOMER PROTECTION
// =========================================================

function ProtectedCustomerRoute({ children }) {
  const token = getCustomerToken();

  // Customer is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =========================================================
// ADMIN PROTECTION
// =========================================================

function ProtectedAdminRoute({
  children,
  allowedRoles = [],
}) {
  const admin = getAdmin();

  // Not logged in
  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  // No specific role restriction
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check role
  if (!allowedRoles.includes(admin.role)) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  return children;
}


// =========================================================
// APP
// =========================================================

function App() {
  return (
    <CartProvider>

      <Navbar />

      <Routes>

      

       {/* CUSTOMER ROUTES */}

<Route
  path="/"
  element={
    <ProtectedCustomerRoute>
      <Home />
    </ProtectedCustomerRoute>
  }
/>

<Route
  path="/menu"
  element={
    <ProtectedCustomerRoute>
      <Menu />
    </ProtectedCustomerRoute>
  }
/>

<Route
  path="/cart"
  element={
    <ProtectedCustomerRoute>
      <Cart />
    </ProtectedCustomerRoute>
  }
/>

<Route
  path="/checkout"
  element={
    <ProtectedCustomerRoute>
      <Checkout />
    </ProtectedCustomerRoute>
  }
/>

<Route
  path="/order-success"
  element={
    <ProtectedCustomerRoute>
      <OrderSuccess />
    </ProtectedCustomerRoute>
  }
/>

<Route
  path="/order-confirmation"
  element={
    <ProtectedCustomerRoute>
      <OrderConfirmation />
    </ProtectedCustomerRoute>
  }
/>

<Route
  path="/my-orders"
  element={
    <ProtectedCustomerRoute>
      <MyOrders />
    </ProtectedCustomerRoute>
  }
/>


        {/* =====================================================
            ADMIN LOGIN
        ===================================================== */}

       <Route
  path="/login"
  element={<CustomerLogin />}
/>

        {/* =====================================================
            ADMIN DASHBOARD
            All logged-in admins can access their dashboard.
        ===================================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
  path="/admin/analytics"
  element={
    <ProtectedAdminRoute allowedRoles={["owner"]}>
      <Analytics />
    </ProtectedAdminRoute>
  }
/>


        {/* =====================================================
            OWNER - ALL ORDERS
        ===================================================== */}

        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute
              allowedRoles={["owner"]}
            >
              <AdminOrders />
            </ProtectedAdminRoute>
          }
        />


<Route
  path="/admin/order-details"
  element={
    <ProtectedAdminRoute
      allowedRoles={[
        "owner",
        "sweets",
        "fastfood",
        "snacks",
        "beverages",
      ]}
    >
      <OrderDetails />
    </ProtectedAdminRoute>
  }
/>

        {/* =====================================================
            OWNER - PRODUCTS
        ===================================================== */}

        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute
              allowedRoles={["owner"]}
            >
              <AdminProducts />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/products/add"
          element={
            <ProtectedAdminRoute
              allowedRoles={["owner"]}
            >
              <AddProduct />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/products/edit/:id"
          element={
            <ProtectedAdminRoute
              allowedRoles={["owner"]}
            >
              <EditProduct />
            </ProtectedAdminRoute>
          }
        />


        {/* =====================================================
            SWEETS ADMIN
        ===================================================== */}

        <Route
          path="/admin/sweets"
          element={
            <ProtectedAdminRoute
              allowedRoles={[
                "owner",
                "sweets",
              ]}
            >
              <SweetsAdmin />
            </ProtectedAdminRoute>
          }
        />


        {/* =====================================================
            FAST FOOD ADMIN
        ===================================================== */}

        <Route
          path="/admin/fast-food"
          element={
            <ProtectedAdminRoute
              allowedRoles={[
                "owner",
                "fastfood",
              ]}
            >
              <FastFoodAdmin />
            </ProtectedAdminRoute>
          }
        />


        {/* =====================================================
            SNACKS ADMIN
        ===================================================== */}

        <Route
          path="/admin/snacks"
          element={
            <ProtectedAdminRoute
              allowedRoles={[
                "owner",
                "snacks",
              ]}
            >
              <SnacksAdmin />
            </ProtectedAdminRoute>
          }
        />


        {/* =====================================================
            BEVERAGES ADMIN
        ===================================================== */}

        <Route
          path="/admin/beverages"
          element={
            <ProtectedAdminRoute
              allowedRoles={[
                "owner",
                "beverages",
              ]}
            >
              <BeveragesAdmin />
            </ProtectedAdminRoute>
          }
        />


        {/* =====================================================
            UNKNOWN ROUTES
        ===================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>


        <Route
  path="/customer/register"
  element={<CustomerRegister />}
/>

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>


      </Routes>

    </CartProvider>
  );
}

export default App;