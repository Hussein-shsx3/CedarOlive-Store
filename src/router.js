import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import AdminDashboard from "./pages/AdminDashboard";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ResendVerification from "./pages/ResendVerification";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/Protected/PrivateRoute";

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
    path: "/about",
    element: <About />,
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
  },
  {
    path: "/verify/:userId",
    element: <EmailVerificationPage />,
  },
  {
    path: "/resend-verification",
    element: <ResendVerification />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
