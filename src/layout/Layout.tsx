import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Background from "../components/Background/Background"; // global background
import "./Layout.css";

interface LayoutProps {
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onLogout }) => {
  return (
    <div className="layout-container" style={{ position: "relative" }}>
      {/* Persistent background */}
      <Background />

      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Content */}
      <main className="layout-content" style={{ position: "relative", zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
