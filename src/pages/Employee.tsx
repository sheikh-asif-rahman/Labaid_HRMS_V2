import React from "react";
import Search from "../components/Search/Search";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";
import User_Profile from "../components/Employee/User_Profile/User_Profile";
import Last7_Days_Status from "../components/Employee/Last7_Days_Status/Last7_Days_Status";
import Working_Day_Shift from "../components/Employee/Wroking_Day_Shift/Working_Day_Shift";

const Employee: React.FC = () => {
  const handleSearch = (query: string) => console.log("Search:", query);
  const handleNew = () => console.log("New clicked");

const last7DaysData = [
  { day: "7-May", hoursWorked: 6 },
  { day: "8-May", hoursWorked: 5 },
  { day: "9-May", hoursWorked: 8 },
  { day: "10-May", hoursWorked: 7 },
  { day: "11-May", hoursWorked: 4 },
  { day: "12-May", hoursWorked: 8 },
  { day: "13-May", hoursWorked: 3 },
];


  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflowY: "auto",
      }}
    >
      {/* Search */}
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <Search
          placeholder="Search employees..."
          onSearch={handleSearch}
          onNew={handleNew}
        />
      </div>

      {/* Profile full width */}
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <User_Profile />
      </div>

      {/* Row: 3 components side by side with spacing */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          flexWrap: "nowrap",
          padding: "10px 0",
          boxSizing: "border-box",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Last7_Days_Status data={last7DaysData} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Working_Day_Shift />
        </div>
      </div>
    </div>
  );
};

export default Employee;
