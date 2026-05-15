


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

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h6V4H4v9Z" />
      <path d="M14 20h6V4h-6v16Z" />
      <path d="M4 20h6v-3H4v3Z" />
    </svg>
  );
}

function StudentsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c.6-3.7 2.6-5.6 5.5-5.6s4.9 1.9 5.5 5.6" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M14.8 14.4c2.9.3 4.8 2 5.4 5.6" />
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

function ReviewsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.7l2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8L12 3.7Z" />
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
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.9 3.2-.2-.1a1.7 1.7 0 0 0-2 .3l-.4.2a1.7 1.7 0 0 0-1 1.5v.2h-3.8v-.2a1.7 1.7 0 0 0-1-1.5l-.4-.2a1.7 1.7 0 0 0-2-.3l-.2.1L5 17l.1-.1a1.7 1.7 0 0 0 .3-1.9v-.5a1.7 1.7 0 0 0-1.3-1.3H4v-3.8h.1a1.7 1.7 0 0 0 1.3-1.3v-.5a1.7 1.7 0 0 0-.3-1.9L5 5.6l1.9-3.2.2.1a1.7 1.7 0 0 0 2-.3l.4-.2a1.7 1.7 0 0 0 1-1.5V.3h3.8v.2a1.7 1.7 0 0 0 1 1.5l.4.2a1.7 1.7 0 0 0 2 .3l.2-.1 1.9 3.2-.1.1a1.7 1.7 0 0 0-.3 1.9v.5a1.7 1.7 0 0 0 1.3 1.3h.1v3.8h-.1a1.7 1.7 0 0 0-1.3 1.3v.5Z" />
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
  { label: "Home", to: "/admin", icon: <HomeIcon /> },
  { label: "Dashboard", to: "/admin/dashboard", icon: <DashboardIcon /> },
  { label: "Student management", to: "/admin/students", icon: <StudentsIcon /> },
  { label: "tuter management", to: "/admin/tutors", icon: <TutorIcon /> },
  { label: "Feedbacks", to: "/admin/reviews", icon: <ReviewsIcon /> },
  { label: "Chats", to: "/admin/chats", icon: <ChatIcon /> },
  { label: "Settings", to: "/admin/settings", icon: <SettingsIcon /> },
];

export default function AdminSideNav({ open, onClose }) {
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




const goToProfileEdit = () => {
  navigate("/admin/settings?section=profile&edit=1");

  if (typeof onClose === "function") {
    onClose();
  }
};



  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <aside
        className={`admin-sidenav admin-icon-sidenav ${open ? "admin-sidenav--open" : ""
          }`}
      >
        <div className="admin-sidenav__top">
          {/* <div className="admin-profile-card"> */}
          <button
  type="button"
  className="admin-profile-card admin-profile-card--clickable"
  onClick={goToProfileEdit}
  title="Edit profile"
>
          
            <div
              className="admin-profile-card__avatar"
              style={{
                overflow: "hidden",
                borderRadius: "50%",
              }}
            >
              {profilePhoto ? (
                <img style={{
                  width: "100%",
                  height: "100%",
                  minWidth: "100%",
                  minHeight: "100%",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                }}
                  src={profilePhoto}
                  alt={user?.name || "Admin"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  
                />
              ) : (
                <span>👨‍💼</span>
              )}
            </div>

            <div className="admin-profile-card__meta">
              <h4>{user?.name || "Admin"}</h4>
              <p>Administrator</p>
            </div>
            
          {/* </div> */}
          </button>

          <nav className="admin-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `admin-nav__link admin-nav-icon-link ${isActive
                    ? "admin-nav__link--active admin-nav-icon-link--active"
                    : ""
                  }`
                }
                onClick={onClose}
              >
                <span className="admin-nav__icon">{item.icon}</span>
                <span className="admin-nav__text">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="admin-logout-btn admin-logout-icon-btn"
          onClick={handleLogout}
        >
          <span className="admin-nav__icon admin-logout-icon">
            <LogoutIcon />
          </span>
          <span>Logout</span>
        </button>
      </aside>

      {open && <div className="admin-sidenav-overlay" onClick={onClose} />}
    </>
  );
}