
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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

// function SettingsIcon() {
//   return (
//     <svg viewBox="0 0 24 24" aria-hidden="true">
//       <circle cx="12" cy="12" r="3" />
//       <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.9 3.2-.2-.1a1.7 1.7 0 0 0-2 .3l-.4.2a1.7 1.7 0 0 0-1 1.5v.2h-3.8v-.2a1.7 1.7 0 0 0-1-1.5l-.4-.2a1.7 1.7 0 0 0-2-.3l-.2.1L5 17l.1-.1a1.7 1.7 0 0 0 .3-1.9v-.5a1.7 1.7 0 0 0-1.3-1.3H4v-3.8h.1a1.7 1.7 0 0 0 1.3-1.3v-.5a1.7 1.7 0 0 0-.3-1.9L5 5.6l1.9-3.2.2.1a1.7 1.7 0 0 0 2-.3l.4-.2a1.7 1.7 0 0 0 1-1.5V.3h3.8v.2a1.7 1.7 0 0 0 1 1.5l.4.2a1.7 1.7 0 0 0 2 .3l.2-.1 1.9 3.2-.1.1a1.7 1.7 0 0 0-.3 1.9v.5a1.7 1.7 0 0 0 1.3 1.3h.1v3.8h-.1a1.7 1.7 0 0 0-1.3 1.3v.5Z" />
//     </svg>
//   );
// }


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

// function fileToBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = () => resolve(reader.result);
//     reader.onerror = reject;

//     reader.readAsDataURL(file);
//   });
// }

function ProfileEditModal({
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
    <div className="admin-profile-edit-overlay" onMouseDown={onClose}>
      <div
        className="admin-profile-edit-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-profile-edit-head">
          <h3>Edit Profile</h3>

          <button
            type="button"
            className="admin-profile-edit-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="admin-profile-edit-body">
          <div className="admin-profile-edit-photo-box">
            {photoSrc ? (
              <img src={photoSrc} alt="Profile" />
            ) : (
              <span>{profileForm.name?.charAt(0)?.toUpperCase() || "A"}</span>
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
            className="admin-profile-edit-save"
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
  { label: "Home", to: "/admin", icon: <HomeIcon /> },
  { label: "Dashboard", to: "/admin/dashboard", icon: <DashboardIcon /> },
  { label: "Student management", to: "/admin/students", icon: <StudentsIcon /> },
  { label: "tutor management", to: "/admin/tutors", icon: <TutorIcon /> },
  { label: "Feedbacks", to: "/admin/reviews", icon: <ReviewsIcon /> },
  { label: "Chats", to: "/admin/chats", icon: <ChatIcon /> },
  { label: "Settings", to: "/admin/settings", icon: <SettingsIcon /> },
];

export default function AdminSideNav({ open, onClose }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(getStoredUser());
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // const [profileForm, setProfileForm] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   photo: "",
  // });





const [profileForm, setProfileForm] = useState({
  name: "",
  email: "",
  phone: "",
  photo: "",
  photoFile: null,
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
            photoFile: null,
        });

        localStorage.setItem("user", JSON.stringify(mergedProfile));
      }
    } catch {
      const storedUser = getStoredUser();

      setUser(storedUser);

      setProfileForm({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        photo:
          storedUser.photo ||
          storedUser.profilePhoto ||
          storedUser.profileImage ||
          storedUser.image ||
          storedUser.avatar ||
          "",
          photoFile: null,
      });
    }
  }

  useEffect(() => {
    loadProfile();

    function handleFocus() {
      loadProfile();
    }

    function handleStorage() {
      const storedUser = getStoredUser();

      setUser(storedUser);

      setProfileForm({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        photo:
          storedUser.photo ||
          storedUser.profilePhoto ||
          storedUser.profileImage ||
          storedUser.image ||
          storedUser.avatar ||
          "",
          photoFile: null,
      });
    }

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        photoFile: null,
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

  // async function handleProfilePhotoSelect(event) {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   const base64 = await fileToBase64(file);

  //   setProfileForm((prev) => ({
  //     ...prev,
  //     photo: base64,
  //   }));
  // }




function handleProfilePhotoSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  setProfileForm((prev) => ({
    ...prev,
    photo: URL.createObjectURL(file),
    photoFile: file,
  }));
}




  // async function saveProfile() {
  //   try {
  //     setSavingProfile(true);

  //     const { data } = await api.put("/update_my_profile", {
  //       name: profileForm.name,
  //       email: profileForm.email,
  //       phone: profileForm.phone,
  //       photo: profileForm.photo,
  //     });

  //     const updated = data?.user || {
  //       ...user,
  //       ...profileForm,
  //     };

  //     const finalUser = {
  //       ...getStoredUser(),
  //       ...updated,
  //       name: updated.name || profileForm.name,
  //       email: updated.email || profileForm.email,
  //       phone: updated.phone || profileForm.phone,
  //       photo: updated.photo || profileForm.photo,
  //     };

  //     setUser(finalUser);
  //     localStorage.setItem("user", JSON.stringify(finalUser));

  //     setProfileModalOpen(false);
  //   } catch (err) {
  //     console.log("Profile update error:", err);
  //   } finally {
  //     setSavingProfile(false);
  //   }
  // }




async function saveProfile() {
  try {
    setSavingProfile(true);

    const formData = new FormData();
    formData.append("name", profileForm.name);
    formData.append("email", profileForm.email);
    formData.append("phone", profileForm.phone);

    if (profileForm.photoFile) {
      formData.append("photo", profileForm.photoFile);
    }

    const { data } = await api.put("/update_my_profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const updated = data?.user || {
      ...user,
      ...profileForm,
    };

    const finalUser = {
      ...getStoredUser(),
      ...updated,
      name: updated.name || profileForm.name,
      email: updated.email || profileForm.email,
      phone: updated.phone || profileForm.phone,
      photo: updated.photo || profileForm.photo,
    };

    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));

    setProfileModalOpen(false);
  } catch (err) {
    console.log("Profile update error:", err);
  } finally {
    setSavingProfile(false);
  }
}






  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <>
      <aside
        className={`admin-sidenav admin-icon-sidenav ${
          open ? "admin-sidenav--open" : ""
        }`}
      >
        <div className="admin-sidenav__top">
          <button
            type="button"
            className="admin-profile-card admin-profile-card--clickable"
            onClick={openProfileEditModal}
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
                <img
                  style={{
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
          </button>

          <nav className="admin-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  `admin-nav__link admin-nav-icon-link ${
                    isActive
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

      <ProfileEditModal
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