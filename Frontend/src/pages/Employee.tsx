import React, { useState } from "react";
import Search from "../components/Search/Search";
import User_Profile from "../components/Employee/User_Profile/User_Profile";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";
import Last7_Days_Status from "../components/Employee/Last7_Days_Status/Last7_Days_Status";
import Working_Day_Shift from "../components/Employee/Wroking_Day_Shift/Working_Day_Shift";
import Popup from "../components/Popup/Popup";
import axios from "axios";

const Employee: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);

  // Popup state
  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const handleSearch = async (query: string) => {
    if (!query) return;

    // Show loading popup
    setPopupType("loading");
    setPopupMessage("");

    try {
      const response = await axios.post("http://localhost:3000/api/employeesearch", { employeeId: query });

      if (response.data?.data) {
        setEmployeeData(response.data.data);

        // Show success popup
        setPopupType("done");
        setPopupMessage("Employee found!");

        // Show edit button
        setShowEdit(true);
      } else {
        setEmployeeData(null);

        setPopupType("notdone");
        setPopupMessage("Employee not found!");
        setShowEdit(false);
      }
    } catch (error) {
      console.error(error);
      setPopupType("notdone");
      setPopupMessage("Error fetching employee data!");
      setShowEdit(false);
    }
  };

  const handleNew = () => {
    setEmployeeData(null);
    setShowEdit(false);
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "20px", display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }}>
      {/* Search */}
      <Search placeholder="Search employees..." onSearch={handleSearch} onNew={handleNew} />

      {/* Profile */}
      <User_Profile employeeData={employeeData} showEditButton={showEdit} />

      {/* Row: Attendance, Last 7 Days, Working Shift */}
      <div style={{ display: "flex", flexDirection: "row", gap: "20px", flexWrap: "nowrap", padding: "10px 0" }}>
        <div style={{ flex: 1 }}>
          <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
        </div>
        <div style={{ flex: 1 }}>
          <Last7_Days_Status data={[]} />
        </div>
        <div style={{ flex: 1 }}>
          <Working_Day_Shift />
        </div>
      </div>

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
