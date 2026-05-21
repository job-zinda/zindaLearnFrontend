import React from "react";
import "./TutorPlaceholderPage.css";

export default function TutorHomePage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="tutor-placeholder-page">
      <div className="tutor-placeholder-card">
        <span className="tutor-placeholder-badge">Tutor Panel</span>

        <h2>Welcome Tutor</h2>

        <p>
          Hello <b>{user?.name || "Tutor"}</b>, you have successfully logged in.
        </p>

        <div className="tutor-placeholder-info">
          <span>Email</span>
          <strong>{user?.email || "No email"}</strong>
        </div>

        <div className="tutor-placeholder-info">
          <span>Phone</span>
          <strong>{user?.phone || "No phone"}</strong>
        </div>
      </div>
    </div>
  );
}