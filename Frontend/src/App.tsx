import React, { type ReactNode } from "react";
import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login_Page from "./pages/Login_Page";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Employee from "./pages/Employee";
import YearlyCalander from "./pages/Yearly_Calendar";
import LeaveManagement from "./pages/Leave_Management";
import Reports from "./pages/Reports";
import DepartmentSetup from "./pages/Department_Setup";
import DesignationSetup from "./pages/Designation_Setup";
import RulesPermission from "./pages/Rules_Permission";
import LeaveApproval from "./pages/Leave_Approval";
import Layout from "./layout/Layout";

// ---------------- RequireAuth wrapper ----------------
interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const location = useLocation();

  // Check if user exists in localStorage
  const user = localStorage.getItem("user");

  if (!user) {
    // Not logged in → go to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>; // Render protected content
};

// ---------------- App ----------------
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login_Page />} />

      {/* Protected routes with Layout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
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

      {/* Catch-all: redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ---------------- Main App ----------------
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
