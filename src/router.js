import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Profile from "./pages/profilePage/Profile";
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
import Orders from "./components/profilePage/orders";
import Payment from "./components/profilePage/payment";
import PersonalInformation from "./components/profilePage/personalInformation";
import Wishlist from "./components/profilePage/wishlist";

//Admin Page
import Dashboard from "./components/adminPage/Dashboard";
import Customers from "./components/adminPage/Customers";
import Products from "./components/adminPage/Products";
import EditUser from "./components/adminPage/customers/editUser";

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
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
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
        path: "/admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/customers",
        element: <Customers />,
      },
      {
        path: "/admin/users/edit/:userId",
        element: <EditUser />,
      },
      {
        path: "/admin/products",
        element: <Products />,
        // children: [
        //   {
        //     path: "/admin",
        //     element: <Dashboard />,
        //   },
        // ],
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
