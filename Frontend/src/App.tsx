import React, { type ReactNode } from "react";
import "./index.css"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // যদি login না থাকে → redirect to /login এবং original path state এ save হবে
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>; // children render
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
        <Route
          path="overview"
          element={
            <RequireAuth>
              <Overview />
            </RequireAuth>
          }
        />
        <Route
          path="employee"
          element={
            <RequireAuth>
              <Employee />
            </RequireAuth>
          }
        />
        <Route
          path="yearlycalander"
          element={
            <RequireAuth>
              <YearlyCalander />
            </RequireAuth>
          }
        />
        <Route
          path="leavemanagement"
          element={
            <RequireAuth>
              <LeaveManagement />
            </RequireAuth>
          }
        />
        <Route
          path="departmentsetup"
          element={
            <RequireAuth>
              <DepartmentSetup />
            </RequireAuth>
          }
        />
        <Route
          path="designationsetup"
          element={
            <RequireAuth>
              <DesignationSetup />
            </RequireAuth>
          }
        />
        <Route
          path="leaveapproval"
          element={
            <RequireAuth>
              <LeaveApproval />
            </RequireAuth>
          }
        />
        <Route
          path="rulespermission"
          element={
            <RequireAuth>
              <RulesPermission />
            </RequireAuth>
          }
        />
        <Route
          path="reports"
          element={
            <RequireAuth>
              <Reports />
            </RequireAuth>
          }
        />
      </Route>

      {/* Catch-all: redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// ---------------- Main App ----------------
const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
