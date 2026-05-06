
import React from "react";
import { Navigate } from "react-router-dom";

function normalizeRole(role) {
  return String(role || "").toLowerCase().trim().replace(/_/g, "");
}

export default function ProtectedRoute({ allowedRole, children }) {
  const token = localStorage.getItem("token");
  const role = normalizeRole(localStorage.getItem("role"));
  const allowed = normalizeRole(allowedRole);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowed && role !== allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}


