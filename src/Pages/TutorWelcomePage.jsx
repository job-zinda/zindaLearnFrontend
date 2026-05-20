import React from "react";
import "./TutorWelcomePage.css";

export default function TutorWelcomePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="tutor-welcome-page">
      <div className="tutor-welcome-card">
        <div className="tutor-welcome-badge">Tutor Panel</div>

        <h1>Welcome Tutor</h1>

        <p>
          Hello <b>{user?.name || "Tutor"}</b>, you have successfully logged in.
        </p>

        <div className="tutor-welcome-info">
          <span>Email</span>
          <strong>{user?.email || "No email"}</strong>
        </div>

        <div className="tutor-welcome-info">
          <span>Phone</span>
          <strong>{user?.phone || "No phone"}</strong>
        </div>

        <button
          className="tutor-welcome-logout"
          type="button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}