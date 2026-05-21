import React from "react";
import "./TutorPlaceholderPage.css";

export default function TutorPlaceholderPage({ title = "Tutor Panel" }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="tutor-placeholder-page">
      <div className="tutor-placeholder-card">
        <span className="tutor-placeholder-badge">Tutor Panel</span>

        <h2>{title}</h2>

        <p>
          Hello <b>{user?.name || "Tutor"}</b>, this section will be available
          soon.
        </p>
      </div>
    </div>
  );
}