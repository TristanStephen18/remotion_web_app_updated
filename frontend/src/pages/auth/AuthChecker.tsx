import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🚫 no token = redirect to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
