// src/pages/Employee.tsx
import React from "react";
import Search from "../components/Search/Search";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";
import User_Profile from "../components/Employee/User_Profile/User_Profile";
import Working_Day_Shift from "../components/Employee/Wroking_Day_Shift/Working_Day_Shift";

const Employee: React.FC = () => {
  const handleSearch = (query: string) => console.log("Search:", query);
  const handleNew = () => console.log("New clicked");

  return (
    <div
      style={{
        minHeight: "100vh",       // allow content to grow
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflowY: "auto",        // enable vertical scrolling
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

      {/* First row: Profile full width */}
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <User_Profile />
      </div>

      {/* Second row: Attendance + Working Day Shift side by side */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          flexWrap: "nowrap",        // prevent wrapping
        }}
      >
        {/* Left: Attendance */}
        <div style={{ width: "50%" }}>
          <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
        </div>

        {/* Right: Working Day Shift */}
        <div style={{ width: "50%" }}>
          <Working_Day_Shift />
        </div>
      </div>
    </div>
  );
};

export default Employee;
