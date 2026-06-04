// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { getMediaUrl } from "../utils/media";

// function HomeIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M3 10.8 12 3l9 7.8" />
//       <path d="M5.5 10.5V21h13V10.5" />
//       <path d="M9.5 21v-6h5v6" />
//     </svg>
//   );
// }

// function TutorIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
//       <path d="M7 11v4.5c0 1.7 2.2 3 5 3s5-1.3 5-3V11" />
//       <path d="M21 8.5v5" />
//     </svg>
//   );
// }

// function AboutIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <circle cx="12" cy="12" r="9" />
//       <path d="M12 10v7" />
//       <path d="M12 7h.01" />
//     </svg>
//   );
// }

// function ChatIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 6.5h14v9.5H9l-4 3v-12.5Z" />
//     </svg>
//   );
// }

// function SettingsIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4.5 21c.8-4 3.6-6 7.5-6s6.7 2 7.5 6" />
//     </svg>
//   );
// }

// function LogoutIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M10 17l5-5-5-5" />
//       <path d="M15 12H3" />
//       <path d="M21 3v18h-8" />
//     </svg>
//   );
// }

// function getStoredUser() {
//   try {
//     return JSON.parse(localStorage.getItem("user") || "{}");
//   } catch {
//     return {};
//   }
// }

// function getImageSrc(value) {
//   if (!value) return "";

//   const src = String(value).trim();

//   if (
//     src.startsWith("data:image") ||
//     src.startsWith("blob:") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://")
//   ) {
//     return src;
//   }

//   return getMediaUrl(src);
// }

// const navItems = [
//   { label: "Home", to: "/tutor", icon: <HomeIcon /> },
//   { label: "Tutors", to: "/tutor/tutors", icon: <TutorIcon /> },
//   { label: "About", to: "/tutor/about", icon: <AboutIcon /> },
//   { label: "Chats", to: "/tutor/chats", icon: <ChatIcon /> },
//   { label: "Settings", to: "/tutor/settings", icon: <SettingsIcon /> },
// ];

// export default function TutorSideNav({ open, onClose }) {
//   const navigate = useNavigate();
//   const user = getStoredUser();

//   const profilePhoto =
//     getImageSrc(user?.photo) ||
//     getImageSrc(user?.profilePhoto) ||
//     getImageSrc(user?.profileImage) ||
//     getImageSrc(user?.image) ||
//     getImageSrc(user?.avatar);

//   function handleLogout() {
//     localStorage.clear();
//     navigate("/");
//   }

//   return (
//     <>
//       <aside
//         className={`admin-sidenav tutor-sidenav ${
//           open ? "admin-sidenav--open" : ""
//         }`}
//       >
//         <div className="admin-sidenav__top">
//           <div className="admin-profile-card tutor-profile-card">
//             <div className="admin-profile-card__avatar">
//               {profilePhoto ? (
//                 <img src={profilePhoto} alt={user?.name || "Tutor"} />
//               ) : (
//                 <span>👨‍🏫</span>
//               )}
//             </div>

//             <div className="admin-profile-card__meta">
//               <h4>{user?.name || "Tutor"}</h4>
//               <p>Tutor</p>
//             </div>
//           </div>

//           <nav className="admin-nav tutor-nav">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 end={item.to === "/tutor"}
//                 className={({ isActive }) =>
//                   `admin-nav__link tutor-nav__link ${
//                     isActive
//                       ? "admin-nav__link--active tutor-nav__link--active"
//                       : ""
//                   }`
//                 }
//                 onClick={onClose}
//               >
//                 <span>{item.icon}</span>
//                 <span>{item.label}</span>
//               </NavLink>
//             ))}
//           </nav>
//         </div>

//         <button
//           type="button"
//           className="admin-logout-btn tutor-logout-btn"
//           onClick={handleLogout}
//         >
//           <span>
//             <LogoutIcon />
//           </span>

//           <span>Logout</span>
//         </button>
//       </aside>

//       {open && <div className="admin-sidenav-overlay" onClick={onClose} />}
//     </>
//   );
// }


















































// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { getMediaUrl } from "../utils/media";

// function HomeIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M3 10.8 12 3l9 7.8" />
//       <path d="M5.5 10.5V21h13V10.5" />
//       <path d="M9.5 21v-6h5v6" />
//     </svg>
//   );
// }

// function TutorIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M3 8.5 12 4l9 4.5-9 4.5L3 8.5Z" />
//       <path d="M7 11v4.5c0 1.7 2.2 3 5 3s5-1.3 5-3V11" />
//       <path d="M21 8.5v5" />
//     </svg>
//   );
// }

// function AboutIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <circle cx="12" cy="12" r="9" />
//       <path d="M12 10v7" />
//       <path d="M12 7h.01" />
//     </svg>
//   );
// }

// function ChatIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M5 6.5h14v9.5H9l-4 3v-12.5Z" />
//     </svg>
//   );
// }

// function SettingsIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <circle cx="12" cy="8" r="4" />
//       <path d="M4.5 21c.8-4 3.6-6 7.5-6s6.7 2 7.5 6" />
//     </svg>
//   );
// }

// function LogoutIcon() {
//   return (
//     <svg viewBox="0 0 24 24">
//       <path d="M10 17l5-5-5-5" />
//       <path d="M15 12H3" />
//       <path d="M21 3v18h-8" />
//     </svg>
//   );
// }

// function getStoredUser() {
//   try {
//     return JSON.parse(localStorage.getItem("user") || "{}");
//   } catch {
//     return {};
//   }
// }

// function getImageSrc(value) {
//   if (!value) return "";

//   const src = String(value).trim();

//   if (
//     src.startsWith("data:image") ||
//     src.startsWith("blob:") ||
//     src.startsWith("http://") ||
//     src.startsWith("https://")
//   ) {
//     return src;
//   }

//   return getMediaUrl(src);
// }

// const navItems = [
//   {
//     label: "Home",
//     to: "/tutor",
//     icon: <HomeIcon />,
//   },

//   {
//     label: "Tutors",
//     to: "/tutor/tutors",
//     icon: <TutorIcon />,
//   },

//   {
//     label: "About",
//     to: "/tutor/about",
//     icon: <AboutIcon />,
//   },

//   {
//     label: "Chats",
//     to: "/tutor/chats",
//     icon: <ChatIcon />,
//   },

//   {
//     label: "Settings",
//     to: "/tutor/settings",
//     icon: <SettingsIcon />,
//   },
// ];

// export default function TutorSideNav({ open, onClose }) {
//   const navigate = useNavigate();

//   const user = getStoredUser();

//   const profilePhoto =
//     getImageSrc(user?.photo) ||
//     getImageSrc(user?.profilePhoto) ||
//     getImageSrc(user?.profileImage) ||
//     getImageSrc(user?.image) ||
//     getImageSrc(user?.avatar);

//   function handleLogout() {
//     localStorage.clear();
//     sessionStorage.clear();

//     navigate("/");
//   }

//   return (
//     <>
//       <aside
//         className={`admin-sidenav tutor-sidenav ${
//           open ? "admin-sidenav--open" : ""
//         }`}
//       >
//         <div className="admin-sidenav__top">
//           {/* ================= PROFILE CARD ================= */}

//           <div className="admin-profile-card tutor-profile-card">
//             <div className="admin-profile-card__avatar">
//               {profilePhoto ? (
//                 <img
//                   src={profilePhoto}
//                   alt={user?.name || "Tutor"}
//                 />
//               ) : (
//                 <span>
//                   {user?.name?.charAt(0)?.toUpperCase() || "T"}
//                 </span>
//               )}
//             </div>

//             <div className="admin-profile-card__meta">
//               <h4>{user?.name || "Tutor"}</h4>

//               <p>Tutor</p>
//             </div>
//           </div>

//           {/* ================= NAVIGATION ================= */}

//           <nav className="admin-nav tutor-nav">
//             {navItems.map((item) => (
//               <NavLink
//                 key={item.to}
//                 to={item.to}
//                 end={item.to === "/tutor"}
//                 className={({ isActive }) =>
//                   `admin-nav__link tutor-nav__link ${
//                     isActive
//                       ? "admin-nav__link--active tutor-nav__link--active"
//                       : ""
//                   }`
//                 }
//                 onClick={() => {
//                   if (onClose) {
//                     onClose();
//                   }
//                 }}
//               >
//                 <span className="admin-nav__icon">
//                   {item.icon}
//                 </span>

//                 <span className="admin-nav__text">
//                   {item.label}
//                 </span>
//               </NavLink>
//             ))}
//           </nav>
//         </div>

//         {/* ================= LOGOUT BUTTON ================= */}

//         <button
//           type="button"
//           className="admin-logout-btn tutor-logout-btn"
//           onClick={handleLogout}
//         >
//           <span className="admin-logout-btn__icon">
//             <LogoutIcon />
//           </span>

//           <span>Logout</span>
//         </button>
//       </aside>

//       {/* ================= MOBILE OVERLAY ================= */}

//       {open && (
//         <div
//           className="admin-sidenav-overlay"
//           onClick={onClose}
//         />
//       )}
//     </>
//   );
// }



























































import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

function TutorProfileEditModal({
  open,
  profileForm,
  photoSrc,
  saving,
  onClose,
  onPhotoSelect,
  onChange,
  onSave,
}) {
  if (!open) return null;

  return createPortal(
    <div className="tutor-profile-edit-overlay" onMouseDown={onClose}>
      <div
        className="tutor-profile-edit-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="tutor-profile-edit-head">
          <h3>Edit Profile</h3>

          <button
            type="button"
            className="tutor-profile-edit-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="tutor-profile-edit-body">
          <div className="tutor-profile-edit-photo-box">
            {photoSrc ? (
              <img src={photoSrc} alt="Profile" />
            ) : (
              <span>{profileForm.name?.charAt(0)?.toUpperCase() || "T"}</span>
            )}

            <label>
              Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={onPhotoSelect}
              />
            </label>
          </div>

          <label>Full Name</label>
          <input
            value={profileForm.name}
            onChange={(e) => onChange("name", e.target.value)}
          />

          <label>Email ID</label>
          <input
            value={profileForm.email}
            onChange={(e) => onChange("email", e.target.value)}
          />

          <label>Phone Number</label>
          <input
            value={profileForm.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />

          <button
            type="button"
            className="tutor-profile-edit-save"
            disabled={saving}
            onClick={onSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
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

  const [user, setUser] = useState(getStoredUser());
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
  });

  const profilePhoto =
    getImageSrc(user?.photo) ||
    getImageSrc(user?.profilePhoto) ||
    getImageSrc(user?.profileImage) ||
    getImageSrc(user?.image) ||
    getImageSrc(user?.avatar);

  const profileEditPhotoSrc = useMemo(
    () => getImageSrc(profileForm.photo),
    [profileForm.photo]
  );

  async function loadProfile() {
    try {
      const { data } = await api.get("/my_profile");
      const profile = data?.user || data?.data || null;

      if (profile) {
        const mergedProfile = {
          ...getStoredUser(),
          ...profile,
        };

        setUser(mergedProfile);

        setProfileForm({
          name: mergedProfile.name || "",
          email: mergedProfile.email || "",
          phone: mergedProfile.phone || "",
          photo:
            mergedProfile.photo ||
            mergedProfile.profilePhoto ||
            mergedProfile.profileImage ||
            mergedProfile.image ||
            mergedProfile.avatar ||
            "",
        });

        localStorage.setItem("user", JSON.stringify(mergedProfile));
      }
    } catch {
      setUser(getStoredUser());
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function openProfileEditModal() {
    setProfileForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      photo:
        user?.photo ||
        user?.profilePhoto ||
        user?.profileImage ||
        user?.image ||
        user?.avatar ||
        "",
    });

    setProfileModalOpen(true);

    if (typeof onClose === "function") {
      onClose();
    }
  }

  function handleProfileFormChange(name, value) {
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleProfilePhotoSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    setProfileForm((prev) => ({
      ...prev,
      photo: base64,
    }));
  }

  async function saveProfile() {
    try {
      setSavingProfile(true);

      const { data } = await api.put("/update_my_profile", {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        photo: profileForm.photo,
      });

      const updated = data?.user || {
        ...user,
        ...profileForm,
      };

      const finalUser = {
        ...getStoredUser(),
        ...updated,
      };

      setUser(finalUser);

      localStorage.setItem("user", JSON.stringify(finalUser));
      window.dispatchEvent(new Event("storage"));

      setProfileModalOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setSavingProfile(false);
    }
  }

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
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
          <button
            type="button"
            className="admin-profile-card tutor-profile-card tutor-profile-card--clickable"
            onClick={openProfileEditModal}
          >
            <div className="admin-profile-card__avatar">
              {profilePhoto ? (
                <img src={profilePhoto} alt={user?.name || "Tutor"} />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || "T"}</span>
              )}
            </div>

            <div className="admin-profile-card__meta">
              <h4>{user?.name || "Tutor"}</h4>
              <p>Tutor</p>
            </div>
          </button>

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
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                <span className="admin-nav__icon">{item.icon}</span>
                <span className="admin-nav__text">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          type="button"
          className="admin-logout-btn tutor-logout-btn"
          onClick={handleLogout}
        >
          <span className="admin-logout-btn__icon">
            <LogoutIcon />
          </span>
          <span>Logout</span>
        </button>
      </aside>

      {open && <div className="admin-sidenav-overlay" onClick={onClose} />}

      <TutorProfileEditModal
        open={profileModalOpen}
        profileForm={profileForm}
        photoSrc={profileEditPhotoSrc}
        saving={savingProfile}
        onClose={() => setProfileModalOpen(false)}
        onPhotoSelect={handleProfilePhotoSelect}
        onChange={handleProfileFormChange}
        onSave={saveProfile}
      />
    </>
  );
}