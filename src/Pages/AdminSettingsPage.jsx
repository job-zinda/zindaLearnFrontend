

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createPortal } from "react-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import InlineAlert from "../Components/InlineAlert";

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
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

  return src;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="admin-settings-modal-overlay" onMouseDown={onClose}>
      <div
        className="admin-settings-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="admin-settings-modal-head">
          <h3>{title}</h3>
          <button
            type="button"
            className="admin-settings-modal-close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="admin-settings-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

const sections = [
  { key: "profile", label: "Profile Edit" },
  { key: "password", label: "Change Password" },
];

// export default function AdminSettingsPage() {
//   const { showAlert } = useAlert();

export default function AdminSettingsPage() {
  const { showAlert } = useAlert();
  const [searchParams] = useSearchParams();

  const [activeSection, setActiveSection] = useState("profile");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPass: "",
    newPass: "",
    confirmPass: "",
  });

  const photoSrc = useMemo(
    () => getImageSrc(profileForm.photo),
    [profileForm.photo]
  );

  async function fetchProfile() {
    try {
      const { data } = await api.get("/my_profile");
      const user = data?.user || null;

      setProfile(user);

      if (user) {
        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          photo: user.photo || "",
        });
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load profile"), "error");
    }
  }

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  useEffect(() => {
  const section = searchParams.get("section");
  const edit = searchParams.get("edit");

  if (section === "profile") {
    setActiveSection("profile");
    setMobileDetailOpen(true);

    if (edit === "1") {
      setProfileModalOpen(true);
    }
  }

  if (section === "password") {
    setActiveSection("password");
    setMobileDetailOpen(true);
  }
}, [searchParams]);

  function openSection(key) {
    setActiveSection(key);

    if (key === "profile") {
      setProfileModalOpen(true);
    }

    if (key === "password") {
      setPasswordModalOpen(true);
    }

    setMobileDetailOpen(true);
  }

  async function handlePhotoSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setProfileForm((prev) => ({ ...prev, photo: base64 }));
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
        ...profile,
        ...profileForm,
      };

      setProfile(updated);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(JSON.parse(localStorage.getItem("user") || "{}")),
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          photo: updated.photo,
        })
      );

      showAlert("Profile updated successfully", "success");
      setProfileModalOpen(false);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to update profile"), "error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword() {
    if (!passwordForm.oldPass || !passwordForm.newPass || !passwordForm.confirmPass) {
      showAlert("All password fields are required", "error");
      return;
    }

    if (passwordForm.newPass !== passwordForm.confirmPass) {
      showAlert("New password and confirm password do not match", "error");
      return;
    }

    try {
      setSavingPassword(true);

      await api.put("/change_password", {
        oldPass: passwordForm.oldPass,
        newPass: passwordForm.newPass,
        confirmPass: passwordForm.confirmPass,
      });

      showAlert("Password changed successfully", "success");
      setPasswordModalOpen(false);
      setPasswordForm({
        oldPass: "",
        newPass: "",
        confirmPass: "",
      });
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to change password"), "error");
    } finally {
      setSavingPassword(false);
    }
  }

  function renderContent() {
    if (activeSection === "profile") {
      return (
        <div className="admin-settings-content-card">
          <h2>Profile Edit</h2>

          <div className="admin-settings-profile-view">
            <div className="admin-settings-profile-avatar">
              {getImageSrc(profile?.photo) ? (
                <img
                  src={getImageSrc(profile.photo)}
                  alt={profile?.name || "Admin"}
                />
              ) : (
                <span>{profile?.name?.charAt(0)?.toUpperCase() || "A"}</span>
              )}
            </div>

            <div>
              <h3>{profile?.name || "Admin"}</h3>
              <p>{profile?.email || "No email"}</p>
              <p>{profile?.phone || "No phone"}</p>
            </div>
          </div>

          <button
            type="button"
            className="admin-settings-primary-btn"
            onClick={() => setProfileModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      );
    }

    return (
      <div className="admin-settings-content-card">
        <h2>Change Password</h2>
        <p>You can update your admin account password securely.</p>

        <button
          type="button"
          className="admin-settings-primary-btn"
          onClick={() => setPasswordModalOpen(true)}
        >
          Change Password
        </button>
      </div>
    );
  }

  return (
    <div className="admin-settings-page">
      <InlineAlert />

      <div className="admin-settings-layout">
        <aside
          className={`admin-settings-menu ${
            mobileDetailOpen ? "admin-settings-menu--hide-mobile" : ""
          }`}
        >
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              className={activeSection === section.key ? "active" : ""}
              onClick={() => openSection(section.key)}
            >
              {section.label}
            </button>
          ))}
        </aside>

        <main
          className={`admin-settings-content ${
            mobileDetailOpen ? "admin-settings-content--open-mobile" : ""
          }`}
        >
          <button
            type="button"
            className="admin-settings-mobile-back"
            onClick={() => setMobileDetailOpen(false)}
          >
            ← Back
          </button>

          {renderContent()}
        </main>
      </div>

      <Modal
        open={profileModalOpen}
        title="Edit Profile"
        onClose={() => setProfileModalOpen(false)}
      >
        <div className="admin-settings-form">
          <div className="admin-settings-photo-box">
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
                onChange={handlePhotoSelect}
              />
            </label>
          </div>

          <label>Full Name</label>
          <input
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <label>Email ID</label>
          <input
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <label>Phone Number</label>
          <input
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />

          <button
            type="button"
            className="admin-settings-primary-btn"
            disabled={savingProfile}
            onClick={saveProfile}
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>

      <Modal
        open={passwordModalOpen}
        title="Change Password"
        onClose={() => setPasswordModalOpen(false)}
      >
        <div className="admin-settings-form">
          <label>Current Password</label>
          <input
            type="password"
            value={passwordForm.oldPass}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, oldPass: e.target.value }))
            }
          />

          <label>New Password</label>
          <input
            type="password"
            value={passwordForm.newPass}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, newPass: e.target.value }))
            }
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={passwordForm.confirmPass}
            onChange={(e) =>
              setPasswordForm((prev) => ({
                ...prev,
                confirmPass: e.target.value,
              }))
            }
          />

          <button
            type="button"
            className="admin-settings-primary-btn"
            disabled={savingPassword}
            onClick={changePassword}
          >
            {savingPassword ? "Changing..." : "Change Password"}
          </button>
        </div>
      </Modal>
    </div>
  );
}