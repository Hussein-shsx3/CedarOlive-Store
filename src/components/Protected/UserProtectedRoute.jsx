import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const UserProtectedRoute = ({ children }) => {
  const { currentUser, status } = useSelector((state) => state.user);
  const location = useLocation();

  // Show loading state while authentication is being checked
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  // If not logged in, redirect to sign in page with a return URL
  if (!currentUser) {
    return (
      <Navigate to="/signIn" state={{ from: location.pathname }} replace />
    );
  }

  // User is authenticated, render the protected content
  return children;
};

export default UserProtectedRoute;
