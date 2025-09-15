// src/pages/Home.tsx
import React from "react";
import Current_Month_Status from "../components/Home/Current_Month_Status/Current_Month_Status";
import Recent_Applications from "../components/Home/Recent_Applications/Recent_Applications";
import Profile from "../components/Home/Profile/Profile";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";

const Home: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        gap: "20px",
        overflow: "hidden",
      }}
    >
      {/* Left Column - 70% width */}
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* Current Month Status */}
        <Current_Month_Status />

        {/* Attendance + Recent Applications Row */}
        <div
          style={{
            display: "flex",
            width: "100%",        // fill the left column
            gap: "20px",
            marginTop: 0,         // remove top margin
            paddingTop: 0,        // remove top padding
            boxSizing: "border-box",
            alignItems: "flex-start", // align to top
          }}
        >
          {/* Attendance on the left */}
          <div style={{ width: "35%", marginTop: 0, paddingTop: 0 }}>
            <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
          </div>

          {/* Recent Applications on the right */}
          <div style={{ width: "65%", marginTop: 0, paddingTop: 0 }}>
            <Recent_Applications />
          </div>
        </div>
      </div>

      {/* Right Column - 30% width */}
      <div style={{ width: "30%", boxSizing: "border-box" }}>
        <Profile />
      </div>
    </div>
  );
};

export default Home;
