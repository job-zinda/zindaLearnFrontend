

import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import StudentSideNav from "./StudentSideNav";
import StudentTopNav from "./StudentTopNav";
import StudentFooter from "./StudentFooter";
import InlineAlert from "./InlineAlert";

export default function StudentLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = useMemo(() => {
    if (location.pathname === "/student") return "Home";
    if (location.pathname.includes("/student/tutors")) return "Tutors";
    if (location.pathname.includes("/student/chats")) return "Chats";
    if (location.pathname.includes("/student/settings")) return "Settings";
    if (location.pathname.includes("/student/courses")) return "Courses";
    return "Student Panel";
  }, [location.pathname]);

  return (
    <div className="admin-shell">
      <InlineAlert />

      <StudentSideNav
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <StudentTopNav
        title={pageTitle}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <main className="admin-content">
        <div className="admin-content__inner">
          <Outlet />
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}