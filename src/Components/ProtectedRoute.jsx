
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function normalizeRole(role) {
  return String(role || "").toLowerCase().trim().replace(/_/g, "");
}

export default function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = normalizeRole(localStorage.getItem("role"));
  const allowed = normalizeRole(allowedRole);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role === "guest") {
    if (allowed !== "student") {
      return <Navigate to="/" replace />;
    }
    // Guests cannot access chats or settings
    if (
      location.pathname.includes("/chats") ||
      location.pathname.includes("/settings")
    ) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  if (allowed && role !== allowed) {
    return <Navigate to="/" replace />;
  }

  return children;
}


