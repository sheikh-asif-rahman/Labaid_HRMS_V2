import React from "react";
import "./index.css"; // <-- this is required!

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Employee from "./pages/Employee";
import HolidayCalendar from "./pages/Holiday_Calendar";
import LeaveManagement from "./pages/Leave_Management";

import DepartmentSetup from "./pages/Department_Setup";
import DesignationSetup from "./pages/Designation_Setup";
import EmployeeApproval from "./pages/Employee_Approval";
import RulesPermission from "./pages/Rules_Permission";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="employee" element={<Employee />} />
          <Route path="holidaycalendar" element={<HolidayCalendar />} />
          <Route path="leavemanagement" element={<LeaveManagement />} />
          <Route path="departmentsetup" element={<DepartmentSetup />} />
          <Route path="designationsetup" element={<DesignationSetup />} />
          <Route path="employeeapproval" element={<EmployeeApproval />} />
          <Route path="rulespermission" element={<RulesPermission />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
