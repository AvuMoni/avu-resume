// src/components/AdminRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const {
    currentUser,
    userProfile,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>

        <p>
          Checking admin access...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (userProfile?.role !== "admin") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;
