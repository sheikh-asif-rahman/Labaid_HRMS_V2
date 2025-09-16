import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUserShield,
  FaUsers,
  FaCalendarCheck,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaLock,
  FaUserCheck,
  FaBriefcase,
  FaBuilding,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For Logout navigation
  const adminRef = useRef<HTMLDivElement>(null);

  // Admin paths for dropdown auto-open
  const adminPaths = [
    "/rulespermission",
    "/leaveapproval",
    "/designationsetup",
    "/departmentsetup",
  ];

  const isAdminActive = adminPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Auto-open dropdown on first load if current path is admin
  useEffect(() => {
    if (isAdminActive) {
      setIsAdminOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setIsAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when any dropdown link is clicked
  const handleDropdownLinkClick = () => {
    setIsAdminOpen(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-main">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active-link" : ""}`
          }
        >
          <FaHome className="sidebar-icon" />
          <span>Home</span>
        </NavLink>

        {/* Admin dropdown */}
        <div ref={adminRef}>
          <button
            type="button"
            className={`sidebar-link dropdown ${
              isAdminActive ? "active-link" : ""
            }`}
            onClick={() => setIsAdminOpen(!isAdminOpen)}
          >
            <FaUserShield className="sidebar-icon" />
            <span>Admin</span>
            {isAdminOpen ? (
              <FaChevronUp className="chevron" />
            ) : (
              <FaChevronDown className="chevron" />
            )}
          </button>

          <div className={`dropdown-menu ${isAdminOpen ? "open" : ""}`}>
            <NavLink
              to="/rulespermission"
              onClick={handleDropdownLinkClick}
              className={({ isActive }) =>
                `sidebar-sublink ${isActive ? "active-sublink" : ""}`
              }
            >
              <FaLock className="sidebar-icon" />
              <span>Rules & Permission</span>
            </NavLink>

            <NavLink
              to="/leaveapproval"
              onClick={handleDropdownLinkClick}
              className={({ isActive }) =>
                `sidebar-sublink ${isActive ? "active-sublink" : ""}`
              }
            >
              <FaCalendarCheck className="sidebar-icon" />
              <span>Leave Approval</span>
            </NavLink>

            <NavLink
              to="/designationsetup"
              onClick={handleDropdownLinkClick}
              className={({ isActive }) =>
                `sidebar-sublink ${isActive ? "active-sublink" : ""}`
              }
            >
              <FaBriefcase className="sidebar-icon" />
              <span>Designation Setup</span>
            </NavLink>

            <NavLink
              to="/departmentsetup"
              onClick={handleDropdownLinkClick}
              className={({ isActive }) =>
                `sidebar-sublink ${isActive ? "active-sublink" : ""}`
              }
            >
              <FaBuilding className="sidebar-icon" />
              <span>Department Setup</span>
            </NavLink>
          </div>
        </div>

        {/* Reports */}
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active-link" : ""}`
          }
        >
          <FaChartBar className="sidebar-icon" />
          <span>Reports</span>
        </NavLink>

        {/* Employee */}
        <NavLink
          to="/employee"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active-link" : ""}`
          }
        >
          <FaUsers className="sidebar-icon" />
          <span>Employee</span>
        </NavLink>

        {/* Leave Management */}
        <NavLink
          to="/leavemanagement"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active-link" : ""}`
          }
        >
          <FaCalendarCheck className="sidebar-icon" />
          <span>Leave Management</span>
        </NavLink>

        {/* Yearly Calendar */}
        <NavLink
          to="/yearlycalander"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active-link" : ""}`
          }
        >
          <FaCalendarAlt className="sidebar-icon" />
          <span>Yearly Calendar</span>
        </NavLink>
      </div>

      {/* Logout at bottom */}
      <div className="sidebar-footer">
        <button className="sidebar-link logout-btn" >
          <FaSignOutAlt className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
