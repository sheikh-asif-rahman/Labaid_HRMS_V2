import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Current_Month_Status from "../components/Home/Current_Month_Status/Current_Month_Status";
import Profile from "../components/Home/Profile/Profile";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";
import Popup from "../components/Popup/Popup";
import Last7_Days_Status from "../components/Employee/Last7_Days_Status/Last7_Days_Status";

import { API_BASE_URL } from "../constants/apiBase";

interface Last7Day {
  day: string; // YYYY-MM-DD
  hoursWorked: number; // fractional hours
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState<any>(null);
  const [last7DaysData, setLast7DaysData] = useState<Last7Day[]>([]);
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

        const [recentLeave, userProfile, todaysAttendance, monthStatus, last7Days] =
          await Promise.all([
            Promise.resolve(null),
            axios.post(`${API_BASE_URL}usershortprofile`, { EmployeeId }),
            axios.post(`${API_BASE_URL}todaysattendance`, { EmployeeId }),
            axios.post(`${API_BASE_URL}thismonthstatus`, { EmployeeId }),
            axios.post(`${API_BASE_URL}employeesearch`, { employeeId: EmployeeId }),
          ]);

        const allData = {
          recentLeave,
          userProfile: userProfile.data,
          todaysAttendance: todaysAttendance.data,
          monthStatus: monthStatus.data,
        };

        setHomeData(allData);
        localStorage.setItem("homeData", JSON.stringify(allData));

        // map last7DaysPunch to chart format with fractional hours & YYYY-MM-DD date
        const mappedLast7Days: Last7Day[] = last7Days.data.last7DaysPunch.map((p: any) => {
          const [hrsStr, , minsStr] = p.duration.split(" "); // "8 hrs 34 mins"
          const hours = parseInt(hrsStr) || 0;
          const minutes = parseInt(minsStr) || 0;
          const fractionalHours = hours + minutes / 60;

          const date = new Date(p.date);
          const formattedDate = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
            "0" + date.getDate()
          ).slice(-2)}`;

          return { day: formattedDate, hoursWorked: fractionalHours };
        });

        setLast7DaysData(mappedLast7Days);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching home APIs:", err);
      }
    };

    fetchData();
  }, []);

  if (loading || !homeData) return <Popup isOpen={true} type="loading" />;

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
        <Current_Month_Status data={homeData.monthStatus} />

        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "20px",
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: "35%" }}>
            <User_Profile_Attendance
              punchInTime={homeData.todaysAttendance?.PunchInTime || "N/A"}
              totalShiftHours={homeData.todaysAttendance?.TotalShiftHours || 0}
            />
          </div>

          <div style={{ width: "65%" }}>
            <Last7_Days_Status data={last7DaysData} />
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ width: "30%", boxSizing: "border-box" }}>
        <Profile
          data={{
            ...homeData.userProfile,
            DepartmentName: homeData.userProfile.DepartmentName,
            DesignationName: homeData.userProfile.DesignationName,
            BranchName: homeData.userProfile.BranchName,
          }}
        />
      </div>
    </div>
  );
};

export default Home;
