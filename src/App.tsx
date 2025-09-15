import React, { useState } from "react";
import "./index.css"; // <-- this is required!

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Employee from "./pages/Employee";
import YearlyCalander from "./pages/Yearly_Calendar";
import LeaveManagement from "./pages/Leave_Management";
import Reports from "./pages/Reports";

import DepartmentSetup from "./pages/Department_Setup";
import DesignationSetup from "./pages/Designation_Setup";
import EmployeeApproval from "./pages/Employee_Approval";
import RulesPermission from "./pages/Rules_Permission";
import LeaveApproval from "./pages/Leave_Approval";

import Login_Page from "./pages/Login_Page";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // You can replace this with real authentication logic
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    // Show login page first
    return <Login_Page onLogin={handleLogin} />;
  }

  // After login, show the main app
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="employee" element={<Employee />} />
          <Route path="yearlycalander" element={<YearlyCalander />} />
          <Route path="leavemanagement" element={<LeaveManagement />} />
          <Route path="departmentsetup" element={<DepartmentSetup />} />
          <Route path="designationsetup" element={<DesignationSetup />} />
          <Route path="employeeapproval" element={<EmployeeApproval />} />
          <Route path="leaveapproval" element={<LeaveApproval />} />
          <Route path="rulespermission" element={<RulesPermission />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
