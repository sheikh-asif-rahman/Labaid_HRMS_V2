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
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [last7DaysStatus, setLast7DaysStatus] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const handleSearch = async (query: string) => {
    if (!query) return;

    setPopupType("loading");
    setPopupMessage("Fetching employee...");

    try {
      // 🧩 Fetch employee info + today's attendance in parallel
      const [employeeRes, attendanceRes] = await Promise.all([
        axios.post(`${API_BASE_URL}employeesearch`, { employeeId: query }),
        axios.post(`${API_BASE_URL}todaysattendance`, { EmployeeId: query }),
      ]);

      const empResponse = employeeRes.data;
      const attResponse = attendanceRes.data;

      console.log("🔍 Employee API response:", empResponse);
      console.log("🕒 Attendance API response:", attResponse);

      if (empResponse?.data) {
        // ✅ Merge employee info
        const emp = {
          ...empResponse.data,
          PunchInTime:
            attResponse?.data?.PunchInTime ||
            attResponse?.PunchInTime ||
            "N/A",
          TotalShiftHours:
            attResponse?.data?.TotalShiftHours ||
            attResponse?.TotalShiftHours ||
            8,
        };

        console.log("✅ Final merged employee data:", emp);
        setEmployeeData(emp);
        setAttendanceData(attResponse?.data || attResponse);

        // ✅ Prepare last 7 days status
        const last7Days = (empResponse.last7DaysPunch || []).map((day: any) => {
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
        setAttendanceData(null);
        setLast7DaysStatus([]);
        setPopupType("notdone");
        setPopupMessage("Employee not found!");
        setShowEdit(false);
      }
    } catch (err) {
      console.error("❌ Error fetching employee:", err);
      setEmployeeData(null);
      setAttendanceData(null);
      setLast7DaysStatus([]);
      setPopupType("notdone");
      setPopupMessage("Error fetching employee data!");
      setShowEdit(false);
    }
  };

  const handleNew = () => {
    setEmployeeData(null);
    setAttendanceData(null);
    setLast7DaysStatus([]);
    setShowEdit(false);
  };

  const handleProfileUpdate = async (updatedProfile: any) => {
    try {
      setPopupType("loading");
      setPopupMessage("Updating profile...");
      setEmployeeData({ ...employeeData, ...updatedProfile });
      setPopupType("done");
      setPopupMessage("Profile updated successfully!");
    } catch {
      setPopupType("notdone");
      setPopupMessage("Profile update failed!");
    }
  };

  const handleShiftUpdate = async (updatedSchedule: string) => {
    if (!employeeData?.EmployeeId) return;
    try {
      setPopupType("loading");
      setPopupMessage("Updating shift...");
      setEmployeeData({ ...employeeData, ShiftSchedule: updatedSchedule });
      setPopupType("done");
      setPopupMessage("Shift schedule updated successfully!");
    } catch {
      setPopupType("notdone");
      setPopupMessage("Shift schedule update failed!");
    }
  };

  console.log("👀 employeeData before render:", employeeData);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxSizing: "border-box",
      }}
    >
      <Search placeholder="Search employees..." onSearch={handleSearch} onNew={handleNew} />

      <User_Profile
        employeeData={employeeData}
        showEditButton={showEdit}
        onUpdate={handleProfileUpdate}
      />

      {employeeData && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            flexWrap: "nowrap",
            padding: "10px 0",
          }}
        >
          <div style={{ flex: 1 }}>
            <User_Profile_Attendance
              punchInTime={attendanceData?.PunchInTime || "N/A"}
              totalShiftHours={attendanceData?.TotalShiftHours || 8}
            />
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
