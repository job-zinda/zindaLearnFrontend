

import React from "react";
import "./AdminHome.css";

export default function AdminPlaceholder({ title }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>{title}</h2>
        <p>This section is ready for the next frontend step.</p>
      </div>
    </div>
  );
}