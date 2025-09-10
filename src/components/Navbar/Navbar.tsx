import React from "react";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <span className="navbar-brand">LABAID HRMS</span>
        {/* Optional: right side menu can go here */}
      </div>
    </nav>
  );
};

export default Navbar;
