import React from "react";
import { Navigate } from "react-router-dom";
import { useGetCurrentUser } from "../../api/users/userApi";
import LoadingSpinner from "../loading/LoadingSpinner";

function PrivateRoute({ children }) {
  const { data: user, isLoading } = useGetCurrentUser();

  // Show a loading state while fetching user data
  if (isLoading) return <LoadingSpinner />;

  // If the user data is available, check the role
  const isAdmin = user?.role === "admin";

  return isAdmin ? children : <Navigate to="/" />;
}

export default PrivateRoute;
