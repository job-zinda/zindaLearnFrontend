import React, { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TutorSideNav from "./TutorSideNav";
import TutorTopNav from "./TutorTopNav";
import TutorFooter from "./TutorFooter";
import InlineAlert from "./InlineAlert";

export default function TutorLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = useMemo(() => {
    if (location.pathname === "/tutor") return "Home";
    if (location.pathname.includes("/tutor/tutors")) return "Tutors";
    if (location.pathname.includes("/tutor/about")) return "About";
    if (location.pathname.includes("/tutor/chats")) return "Chats";
    if (location.pathname.includes("/tutor/settings")) return "Settings";
    return "Tutor Panel";
  }, [location.pathname]);

  return (
    <div className="admin-shell tutor-shell">
      <InlineAlert />

      <TutorSideNav
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <TutorTopNav
        title={pageTitle}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <main className="admin-content tutor-content">
        <div className="admin-content__inner">
          <Outlet />
        </div>
      </main>

      <TutorFooter />
    </div>
  );
}