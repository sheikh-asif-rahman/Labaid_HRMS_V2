import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  return (
<nav className="custom-navbar">
  <div className="navbar-container">
    <span className="navbar-brand">LABAID HRMS</span>
    <button className="logout-btn" onClick={handleLogoutClick}>
      <FaSignOutAlt />
      Logout
    </button>
  </div>
</nav>

  );
};

export default Navbar;
