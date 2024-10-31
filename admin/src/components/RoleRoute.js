import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  const userRole = localStorage.getItem("role");
  console.log(
    `RoleRoute: isAuthenticated=${isAuthenticated}, userRole=${userRole}, allowedRoles=${allowedRoles}`
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Redirect to an unauthorized page or another route
  }

  return <Outlet />;
};

export default RoleRoute;
