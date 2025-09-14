import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Background from "../components/Background/Background"; // import global background
import "./Layout.css";

const Layout: React.FC = () => {
  return (
    <div className="layout-container" style={{ position: "relative" }}>
      {/* Persistent background */}
      <Background />

      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Content above background */}
      <main className="layout-content" style={{ position: "relative", zIndex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
