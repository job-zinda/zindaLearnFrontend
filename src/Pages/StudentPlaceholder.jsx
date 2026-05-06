

import React from "react";

export default function StudentPlaceholder({ title }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>{title}</h2>
        <p>This section is ready for the next frontend step.</p>
      </div>
    </div>
  );
}