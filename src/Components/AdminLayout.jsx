
import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminFooter from "./AdminFooter";
import AdminSideNav from "./AdminSideNav";
import AdminTopNav from "./AdminTopNav";
import InlineAlert from "./InlineAlert";

const titleMap = {
  "/admin": "Home",
  "/admin/dashboard": "Dashboard",
  "/admin/students": "Student Management",
  "/admin/tutors": "Tuter Management",
  "/admin/reviews": "Reviews",
  "/admin/chats": "Chats",
  "/admin/settings": "Settings",
};

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/admin/courses")) {
      return "Courses";
    }

    return titleMap[location.pathname] || "Admin Panel";
  }, [location.pathname]);

  return (
    <div className="admin-shell">
      <InlineAlert />

      <AdminSideNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <AdminTopNav title={pageTitle} onMenuClick={() => setSidebarOpen(true)} />

      <main className="admin-content">
        <div className="admin-content__inner">
          <Outlet />
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}