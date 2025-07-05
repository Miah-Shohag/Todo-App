import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ThemeContext } from "../hooks/ThemeContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(ThemeContext);

  if (loading) return <div>Loading...</div>; // or a spinner

  if (!user) {
    // Not logged in
    return <Navigate to="" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // User is allowed
  return <Outlet />; // Render nested routes/components
};

export default ProtectedRoute;
