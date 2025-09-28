import React, { useState } from "react";
import Search from "../components/Search/Search";
import User_Profile from "../components/Employee/User_Profile/User_Profile";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";
import Last7_Days_Status from "../components/Employee/Last7_Days_Status/Last7_Days_Status";
import Working_Day_Shift from "../components/Employee/Wroking_Day_Shift/Working_Day_Shift";
import Popup from "../components/Popup/Popup";
import axios from "axios";
import { API_BASE_URL } from "../constants/apiBase";

const Employee: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [last7DaysStatus, setLast7DaysStatus] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false);

  // Popup state
  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  // --- SEARCH EMPLOYEE ---
  const handleSearch = async (query: string) => {
    if (!query) return;

    setPopupType("loading");
    setPopupMessage("Fetching employee...");

    try {
      const response = await axios.post(`${API_BASE_URL}employeesearch`, { employeeId: query });

      if (response.data?.data) {
        setEmployeeData(response.data.data);

        // last 7 days calculation
        const last7Days = (response.data.last7DaysPunch || []).map((day: any) => {
          let hoursWorked = 0;
          if (day.duration) {
            const match = day.duration.match(/(\d+)\s*hrs?\s*(\d+)?\s*mins?/);
            const hours = parseInt(match?.[1] || "0");
            const mins = parseInt(match?.[2] || "0");
            hoursWorked = +(hours + mins / 60).toFixed(2);
          }
          return {
            day: day.date || "N/A",
            hoursWorked,
            firstPunch: day.firstPunch || null,
            lastPunch: day.lastPunch || null,
          };
        });

        setLast7DaysStatus(last7Days);

        setPopupType("done");
        setPopupMessage("Employee found!");
        setShowEdit(true);
      } else {
        setEmployeeData(null);
        setLast7DaysStatus([]);
        setPopupType("notdone");
        setPopupMessage("Employee not found!");
        setShowEdit(false);
      }
    } catch (error) {
      console.error(error);
      setEmployeeData(null);
      setLast7DaysStatus([]);
      setPopupType("notdone");
      setPopupMessage("Error fetching employee data!");
      setShowEdit(false);
    }
  };

  const handleNew = () => {
    setEmployeeData(null);
    setLast7DaysStatus([]);
    setShowEdit(false);
  };

  // --- PROFILE UPDATE ---
  const handleProfileUpdate = async (updatedProfile: any) => {
    try {
      setPopupType("loading");
      setPopupMessage("Updating profile...");

      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        ...updatedProfile,
        UserId: loggedInUser?.EmployeeId || "ADMIN",
        type: "profile"
      };

      const response = await axios.put(`${API_BASE_URL}employeeupdate`, payload);

      // update local state
      setEmployeeData({
        ...employeeData,
        ...updatedProfile
      });

      setPopupType("done");
      setPopupMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      setPopupType("notdone");
      setPopupMessage("Profile update failed!");
    }
  };

  // --- SHIFT UPDATE ---
  const handleShiftUpdate = async (updatedSchedule: string) => {
    if (!employeeData?.EmployeeId) return;

    try {
      setPopupType("loading");
      setPopupMessage("Updating shift...");

      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        EmployeeId: employeeData.EmployeeId,
        UserId: loggedInUser?.EmployeeId || "ADMIN",
        ShiftSchedule: updatedSchedule,
        type: "shift"
      };

      const response = await axios.put(`${API_BASE_URL}employeeupdate`, payload);

      setEmployeeData({
        ...employeeData,
        ShiftSchedule: updatedSchedule
      });

      setPopupType("done");
      setPopupMessage("Shift schedule updated successfully!");
    } catch (error) {
      console.error("Shift update error:", error);
      setPopupType("notdone");
      setPopupMessage("Shift schedule update failed!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }}>
      {/* Search */}
      <Search placeholder="Search employees..." onSearch={handleSearch} onNew={handleNew} />

      {/* Profile */}
      <User_Profile
        employeeData={employeeData}
        showEditButton={showEdit}
        onUpdate={handleProfileUpdate} // <-- now works
      />

      {/* Row: Attendance, Last 7 Days, Working Shift */}
      {employeeData && (
        <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: "nowrap", padding: "10px 0" }}>
          <div style={{ flex: 1 }}>
            <User_Profile_Attendance punchInTime={employeeData?.firstPunchToday || "N/A"} totalShiftHours={8} />
          </div>
          <div style={{ flex: 1 }}>
            <Last7_Days_Status data={last7DaysStatus} />
          </div>
          <div style={{ flex: 1 }}>
            <Working_Day_Shift
              shiftSchedule={employeeData?.ShiftSchedule || ""}
              employeeId={employeeData?.EmployeeId}
              onChange={handleShiftUpdate}
            />
          </div>
        </div>
      )}

      {/* Popup */}
      {popupType && (
        <Popup
          isOpen={true}
          type={popupType}
          message={popupMessage}
          onClose={() => setPopupType(null)}
        />
      )}
    </div>
  );
};

export default Employee;
