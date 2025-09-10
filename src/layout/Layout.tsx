import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
