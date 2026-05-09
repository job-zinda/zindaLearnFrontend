import React from "react";
import schoolLogo from "../assets/5aa1151f-ac87-48fb-a83c-241004a33c64.png";

export default function StudentTopNav({ title, onMenuClick }) {
  return (
    <header className="admin-topnav">
      <div className="admin-topnav__left">
        <button type="button" className="admin-menu-btn" onClick={onMenuClick}>
          ☰
        </button>
        <h1>{title}</h1>
      </div>

      <div className="admin-topnav__right">
        <img
          src={schoolLogo}
          alt="Zindalearn Online School"
          className="admin-topnav__full-logo"
        />
      </div>
    </header>
  );
}