import React, { useState, useEffect, useRef } from "react";
import Current_Month_Status from "../components/Home/Current_Month_Status/Current_Month_Status";
import Recent_Applications from "../components/Home/Recent_Applications/Recent_Applications";
import Profile from "../components/Home/Profile/Profile";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";
import Popup from "../components/Popup/Popup";
import axios from "axios";
import { API_BASE_URL } from "../constants/apiBase";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<any>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return; // prevent double call in StrictMode
    calledRef.current = true;

    const fetchData = async () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const { EmployeeId } = JSON.parse(userStr);

      try {
        setLoading(true);

        // Fetch all APIs in parallel
        const [recentLeave, userProfile, todaysAttendance, monthStatus] =
          await Promise.all([
            axios.post(`${API_BASE_URL}recentleaveapplication`, { EmployeeId }),
            axios.post(`${API_BASE_URL}usershortprofile`, { EmployeeId }),
            axios.post(`${API_BASE_URL}todaysattendance`, { EmployeeId }),
            axios.post(`${API_BASE_URL}thismonthstatus`, { EmployeeId }),
          ]);

        const allData = {
          recentLeave: recentLeave.data,
          userProfile: userProfile.data,
          todaysAttendance: todaysAttendance.data,
          monthStatus: monthStatus.data,
        };

        setHomeData(allData);

        // Log data in console
        console.log("Recent Leave Applications:", recentLeave.data);
        console.log("User Profile:", userProfile.data);
        console.log("Today's Attendance:", todaysAttendance.data);
        console.log("This Month Status:", monthStatus.data);

        setLoading(false); // only close loading when all APIs succeed
      } catch (err) {
        console.error("Error fetching one or more home APIs:", err);
        // loading stays true; popup never closes
      }
    };

    fetchData();
  }, []);

  // Show loading popup until all 4 APIs succeed
  if (loading || !homeData) return <Popup isOpen={true} type="loading" />;

  // Render all components
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
      {/* Left Column */}
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
        <Current_Month_Status />

        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "20px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: "35%" }}>
            <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
          </div>

          <div style={{ width: "65%" }}>
            <Recent_Applications />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ width: "30%", boxSizing: "border-box" }}>
        <Profile />
      </div>
    </div>
  );
};

export default Home;
