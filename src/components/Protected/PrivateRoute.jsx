import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute({ children }) {
  const user = useSelector((state) => state.user.currentUser);

  // If the user data is available, check the role
  const isAdmin = user?.role === "admin";

  return isAdmin ? children : <Navigate to="/" />;
}

export default PrivateRoute;
