import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Main Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess"; // Import the Order Success page

// Auth Pages
import SignUp from "./pages/authPages/SignUp";
import SignIn from "./pages/authPages/SignIn";
import EmailVerificationPage from "./pages/authPages/EmailVerificationPage";
import ResendVerification from "./pages/authPages/ResendVerification";
import ForgotPassword from "./pages/authPages/ForgotPassword";
import ResetPassword from "./pages/authPages/ResetPassword";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./components/adminPage/Dashboard";
import Customers from "./components/adminPage/Customers";
import Products from "./components/adminPage/Products";
import EditUser from "./components/adminPage/customers/editUser";
import ContactMessages from "./components/adminPage/ContactMessages";
import ProductView from "./components/adminPage/products/ProductView";
import OrdersManagement from "./components/adminPage/orders/OrdersManagement";

// Profile
import Profile from "./pages/profilePage/Profile";
import PersonalInformation from "./components/profilePage/personalInformation";
import Wishlist from "./components/profilePage/wishlist";
import Orders from "./components/profilePage/orders";
import ChangePassword from "./components/profilePage/AccountSettings";

// Not Found + Route Protection
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/Protected/PrivateRoute";
import UserProtectedRoute from "./components/Protected/UserProtectedRoute";

// Layout for Scroll Restoration
import Root from "./Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "profile",
        element: (
          <UserProtectedRoute>
            <Profile />
          </UserProtectedRoute>
        ),
        children: [
          { index: true, element: <PersonalInformation /> },
          { path: "orders", element: <Orders /> },
          { path: "wishlist", element: <Wishlist /> },
          { path: "settings", element: <ChangePassword /> },
        ],
      },
      {
        path: "checkout",
        element: (
          <UserProtectedRoute>
            <Cart />
          </UserProtectedRoute>
        ),
      },
      {
        path: "payment-success",
        element: (
          <UserProtectedRoute>
            <OrderSuccess />
          </UserProtectedRoute>
        ),
      },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "blog", element: <Blog /> },
      { path: "product/:id", element: <Product /> },
      { path: "shop/:category", element: <Shop /> },
      {
        path: "admin",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "customers", element: <Customers /> },
          { path: "users/edit/:userId", element: <EditUser /> },
          { path: "products", element: <Products /> },
          { path: "contactMessages", element: <ContactMessages /> },
          { path: "orders", element: <OrdersManagement /> },
          { path: "product/:productId", element: <ProductView /> },
        ],
      },
      { path: "verify/:token", element: <EmailVerificationPage /> },
      { path: "resend-verification", element: <ResendVerification /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "resetPassword/:token", element: <ResetPassword /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "signIn", element: <SignIn /> },
  { path: "signUp", element: <SignUp /> },
]);

export default router;
