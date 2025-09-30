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
  FaBriefcase,
  FaBuilding,
  FaChartBar,
  FaChartLine,
} from "react-icons/fa";
import "./Sidebar.css";

interface SidebarProps {}

interface UserPermission {
  Access: string[];
  Special_Permission: string[];
}

// Config for sidebar links
const sidebarLinks = [
  { name: "Home", path: "/", icon: <FaHome />, access: null },
  { name: "Overview", path: "/overview", icon: <FaChartLine />, access: "Overview" },
  { name: "Reports", path: "/reports", icon: <FaChartBar />, access: "Reports" },
  { name: "Employee", path: "/employee", icon: <FaUsers />, access: "Employee" },
  { name: "Leave Management", path: "/leavemanagement", icon: <FaCalendarCheck />, access: "Leave Management" },
  { name: "Yearly Calendar", path: "/yearlycalander", icon: <FaCalendarAlt />, access: "Yearly Calendar" },
];

// Admin dropdown config
const adminLinks = [
  { name: "Rules & Permission", path: "/rulespermission", icon: <FaLock />, access: "Rules & Permission" },
  { name: "Leave Approval", path: "/leaveapproval", icon: <FaCalendarCheck />, access: "Leave Approval" },
  { name: "Designation Setup", path: "/designationsetup", icon: <FaBriefcase />, access: "Designation Setup" },
  { name: "Department Setup", path: "/departmentsetup", icon: <FaBuilding />, access: "Department Setup" },
];

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const adminRef = useRef<HTMLDivElement>(null);

  const [permissions, setPermissions] = useState<UserPermission>({ Access: [], Special_Permission: [] });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load user permissions from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const perm = parsed.Permission ? JSON.parse(parsed.Permission) : { Access: [], Special_Permission: [] };
        setPermissions(perm);
      } catch (err) {
        console.error("Failed to parse permissions:", err);
        setPermissions({ Access: [], Special_Permission: [] });
      }
    }
  }, []);

  // Check if any admin link is active
  const isAdminActive = adminLinks.some((link) => location.pathname.startsWith(link.path));

  // Auto-close admin dropdown if route changes and not on admin links
  useEffect(() => {
    if (!isAdminActive) {
      setIsAdminOpen(false);
    }
  }, [location.pathname, isAdminActive]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminRef.current && !adminRef.current.contains(e.target as Node)) {
        setIsAdminOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when an admin link is clicked
  const handleAdminLinkClick = () => setIsAdminOpen(false);

  return (
<aside className="sidebar">
  <div className="sidebar-main">
    {/* Render first two links: Home & Overview */}
    {sidebarLinks.slice(0, 2).map(
      (link) =>
        (!link.access || permissions.Access.includes(link.access)) && (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) => `sidebar-link ${isActive ? "active-link" : ""}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        )
    )}

    {/* Admin dropdown at 3rd position */}
    {adminLinks.some((link) => permissions.Access.includes(link.access)) && (
      <div ref={adminRef}>
        <button
          type="button"
          className={`sidebar-link dropdown ${isAdminActive ? "active-link" : ""}`}
          onClick={() => setIsAdminOpen(!isAdminOpen)}
        >
          <FaUserShield className="sidebar-icon" />
          <span>Admin</span>
          {isAdminOpen ? <FaChevronUp className="chevron" /> : <FaChevronDown className="chevron" />}
        </button>

        <div className={`dropdown-menu ${isAdminOpen ? "open" : ""}`}>
          {adminLinks.map(
            (link) =>
              permissions.Access.includes(link.access) && (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={handleAdminLinkClick}
                  className={({ isActive }) => `sidebar-sublink ${isActive ? "active-sublink" : ""}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </NavLink>
              )
          )}
        </div>
      </div>
    )}

    {/* Render remaining links after Admin */}
    {sidebarLinks.slice(2).map(
      (link) =>
        (!link.access || permissions.Access.includes(link.access)) && (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) => `sidebar-link ${isActive ? "active-link" : ""}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        )
    )}
  </div>

  {/* Footer */}
  <div className="sidebar-footer">
    <span>DEVELOPED BY LABAID IT TEAM</span>
    <span>@SHEIKH_ASIF_RAHMAN &nbsp; @YOUSUF_MD_RIYAD</span>
  </div>
</aside>

  );
};

export default Sidebar;
