import React from "react";
import { Navigate } from "react-router-dom";

// Mock authentication function (you can replace this with real logic)
const isAuthenticated = () => {
  const user = { isAdmin: true }; // Example: Replace this with real authentication logic
  return user.isAdmin;
};

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" />;
}

export default PrivateRoute;