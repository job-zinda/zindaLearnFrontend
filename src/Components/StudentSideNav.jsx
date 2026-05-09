

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getMediaUrl } from "../utils/media";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 10.5V21h13V10.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function TutorIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
      <path d="M7 11v4.5c0 1.7 2.2 3 5 3s5-1.3 5-3V11" />
      <path d="M21 8.5v5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6.5h14v9.5H9l-4 3v-12.5Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4 3.6-6 7.5-6s6.7 2 7.5 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
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
  { label: "Home", to: "/student", icon: <HomeIcon /> },
  { label: "Tutors", to: "/student/tutors", icon: <TutorIcon /> },
  { label: "Chats", to: "/student/chats", icon: <ChatIcon /> },
  { label: "Settings", to: "/student/settings", icon: <SettingsIcon /> },
];

export default function StudentSideNav({ open, onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());

  async function loadProfile() {
    try {
      const { data } = await api.get("/my_profile");
      const profile = data?.user || data?.data || null;

      if (profile) {
        setUser(profile);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...getStoredUser(),
            ...profile,
          })
        );
      }
    } catch {
      setUser(getStoredUser());
    }
  }

  useEffect(() => {
    loadProfile();

    function handleFocus() {
      loadProfile();
    }

    function handleStorage() {
      setUser(getStoredUser());
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const profilePhoto =
    getImageSrc(user?.photo) ||
    getImageSrc(user?.profilePhoto) ||
    getImageSrc(user?.profileImage) ||
    getImageSrc(user?.image) ||
    getImageSrc(user?.avatar);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <aside
        className={`admin-sidenav student-sidenav ${
          open ? "admin-sidenav--open" : ""
        }`}
      >
        <div className="admin-sidenav__top">
          <div className="admin-profile-card">
            <div
              className="admin-profile-card__avatar"
              style={{
                overflow: "hidden",
                borderRadius: "50%",
              }}
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={user?.name || "Student"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                 style={{
                  width: "100%",
                  height: "100%",
                  minWidth: "100%",
                  minHeight: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
                />
              ) : (
                <span>👨‍🎓</span>
              )}
            </div>

            <div className="admin-profile-card__meta">
              <h4>{user?.name || "Student"}</h4>
              <p>Student</p>
            </div>
          </div>

          <nav className="admin-nav student-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/student"}
                className={({ isActive }) =>
                  `admin-nav__link student-nav__link ${
                    isActive
                      ? "admin-nav__link--active student-nav__link--active"
                      : ""
                  }`
                }
                onClick={onClose}
              >
                <span className="student-nav__icon">{item.icon}</span>
                <span className="student-nav__text">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="admin-logout-btn student-logout-btn"
          onClick={handleLogout}
        >
          <span className="student-nav__icon student-logout-icon">
            <LogoutIcon />
          </span>
          <span>Logout</span>
        </button>
      </aside>

      {open && <div className="admin-sidenav-overlay" onClick={onClose} />}
    </>
  );
}


