import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getMediaUrl } from "../utils/media";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 10.5V21h13V10.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function TutorIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
      <path d="M7 11v4.5c0 1.7 2.2 3 5 3s5-1.3 5-3V11" />
      <path d="M21 8.5v5" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v7" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 6.5h14v9.5H9l-4 3v-12.5Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4 3.6-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18h-8" />
    </svg>
  );
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

function getImageSrc(value) {
  if (!value) return "";

  const src = String(value).trim();

  if (
    src.startsWith("data:image") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return getMediaUrl(src);
}

const navItems = [
  { label: "Home", to: "/tutor", icon: <HomeIcon /> },
  { label: "Tutors", to: "/tutor/tutors", icon: <TutorIcon /> },
  { label: "About", to: "/tutor/about", icon: <AboutIcon /> },
  { label: "Chats", to: "/tutor/chats", icon: <ChatIcon /> },
  { label: "Settings", to: "/tutor/settings", icon: <SettingsIcon /> },
];

export default function TutorSideNav({ open, onClose }) {
  const navigate = useNavigate();
  const user = getStoredUser();

  const profilePhoto =
    getImageSrc(user?.photo) ||
    getImageSrc(user?.profilePhoto) ||
    getImageSrc(user?.profileImage) ||
    getImageSrc(user?.image) ||
    getImageSrc(user?.avatar);

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <>
      <aside
        className={`admin-sidenav tutor-sidenav ${
          open ? "admin-sidenav--open" : ""
        }`}
      >
        <div className="admin-sidenav__top">
          <div className="admin-profile-card tutor-profile-card">
            <div className="admin-profile-card__avatar">
              {profilePhoto ? (
                <img src={profilePhoto} alt={user?.name || "Tutor"} />
              ) : (
                <span>👨‍🏫</span>
              )}
            </div>

            <div className="admin-profile-card__meta">
              <h4>{user?.name || "Tutor"}</h4>
              <p>Tutor</p>
            </div>
          </div>

          <nav className="admin-nav tutor-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/tutor"}
                className={({ isActive }) =>
                  `admin-nav__link tutor-nav__link ${
                    isActive
                      ? "admin-nav__link--active tutor-nav__link--active"
                      : ""
                  }`
                }
                onClick={onClose}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="admin-logout-btn tutor-logout-btn"
          onClick={handleLogout}
        >
          <span>
            <LogoutIcon />
          </span>

          <span>Logout</span>
        </button>
      </aside>

      {open && <div className="admin-sidenav-overlay" onClick={onClose} />}
    </>
  );
}