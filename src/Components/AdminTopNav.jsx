


import React from "react";
import schoolLogo from "../assets/topnavlogo.jpeg";

export default function AdminTopNav({ title, onMenuClick }) {
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