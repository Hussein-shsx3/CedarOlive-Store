import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import About from "./pages/About";
import Blog from "./pages/Blog";
import SignUp from "./pages/authPages/SignUp";
import SignIn from "./pages/authPages/SignIn";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import EmailVerificationPage from "./pages/authPages/EmailVerificationPage";
import ResendVerification from "./pages/authPages/ResendVerification";
import ForgotPassword from "./pages/authPages/ForgotPassword";
import ResetPassword from "./pages/authPages/ResetPassword";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/Protected/PrivateRoute";

// Profile Page
import Profile from "./pages/profilePage/Profile";
import PersonalInformation from "./components/profilePage/personalInformation";
import Wishlist from "./components/profilePage/wishlist";
import Orders from "./components/profilePage/orders";
import Payment from "./components/profilePage/payment";
import ChangePassword from "./components/profilePage/ChangePassword";

// Admin Page
import Dashboard from "./components/adminPage/Dashboard";
import Customers from "./components/adminPage/Customers";
import Products from "./components/adminPage/Products";
import EditUser from "./components/adminPage/customers/editUser";
import ContactMessages from "./components/adminPage/ContactMessages";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/profile",
    element: <Profile />,
    children: [
      {
        index: true,
        element: <PersonalInformation />,
      },
      {
        path: "",
        element: <PersonalInformation />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "settings",
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/product/:id",
    element: <Product />,
  },
  {
    path: "/shop/:category",
    element: <Shop />,
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AdminDashboard />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "users/edit/:userId",
        element: <EditUser />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "contactMessages",
        element: <ContactMessages />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
    ],
  },
  {
    path: "/verify/:token",
    element: <EmailVerificationPage />,
  },
  {
    path: "/resend-verification",
    element: <ResendVerification />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/resetPassword/:token",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
