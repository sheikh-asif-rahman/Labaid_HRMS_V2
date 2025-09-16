import React, { useState } from "react";
import "./index.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Employee from "./pages/Employee";
import YearlyCalander from "./pages/Yearly_Calendar";
import LeaveManagement from "./pages/Leave_Management";
import Reports from "./pages/Reports";
import DepartmentSetup from "./pages/Department_Setup";
import DesignationSetup from "./pages/Designation_Setup";
import RulesPermission from "./pages/Rules_Permission";
import LeaveApproval from "./pages/Leave_Approval";
import Overview from "./pages/Overview";
import Login_Page from "./pages/Login_Page";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  if (!isLoggedIn) {
    return <Login_Page onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout onLogout={handleLogout} />}>
          <Route index element={<Home />} />
          <Route path="overview" element={<Overview />} />
          <Route path="employee" element={<Employee />} />
          <Route path="yearlycalander" element={<YearlyCalander />} />
          <Route path="leavemanagement" element={<LeaveManagement />} />
          <Route path="departmentsetup" element={<DepartmentSetup />} />
          <Route path="designationsetup" element={<DesignationSetup />} />
          <Route path="leaveapproval" element={<LeaveApproval />} />
          <Route path="rulespermission" element={<RulesPermission />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
