import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./User_Profile_Attendance.css";

interface UserProfileAttendanceProps {
  punchInTime: string; // "HH:mm" or "Not Punch Yet"
  totalShiftHours?: number; // default 8h
}

const User_Profile_Attendance: React.FC<UserProfileAttendanceProps> = ({
  punchInTime,
  totalShiftHours = 8,
}) => {
  const [workedMinutes, setWorkedMinutes] = useState<number>(0);

  useEffect(() => {
    if (punchInTime === "Not Punch Yet") return;

    const calculateWorkedMinutes = () => {
      const now = new Date();
      const punchIn = new Date();
      const [h, m] = punchInTime.split(":").map(Number);
      punchIn.setHours(h, m, 0, 0);

      const diffMinutes = Math.max(0, Math.floor((now.getTime() - punchIn.getTime()) / (1000 * 60)));
      setWorkedMinutes(diffMinutes);
    };

    calculateWorkedMinutes();
    const interval = setInterval(calculateWorkedMinutes, 60 * 1000);

    return () => clearInterval(interval);
  }, [punchInTime]);

  const hours = Math.floor(workedMinutes / 60);
  const minutes = workedMinutes % 60;
  const todayDate = new Date().toLocaleDateString();

  if (punchInTime === "Not Punch Yet") {
    // Show only a centered message
    return (
      <div className="attendance-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: "16px", color: "#555", textAlign: "center" }}>
          Not Punch Yet
        </p>
      </div>
    );
  }

  // Pie chart data
  const workedHoursValue = workedMinutes / 60;
  const data = [
    { name: "Worked", value: workedHoursValue },
    { name: "Remaining", value: Math.max(totalShiftHours - workedHoursValue, 0) },
  ];
  const COLORS = ["#0115a9ff", "#c5c5c5"];

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Attendance</h2>
      <hr className="border-gray-300 my-2" />
      <p className="attendance-date">{todayDate}</p>

      <div className="attendance-progress">
        <PieChart width={120} height={120}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={55}
            startAngle={90}
            endAngle={-270}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>

<div className="progress-center-text">
  <p className="total-hours-label">Worked Time</p>
  <p className="total-hours-value">
    {punchInTime === "Not Punch Yet" ? "Not Punch Yet" : `${hours}h ${minutes}min`}
  </p>
</div>

      </div>

      <hr className="border-gray-300 my-2" />
      <p className="punch-in-text">
        Punch In at: <span className="punch-in-time">{punchInTime}</span>
      </p>
    </div>
  );
};

export default User_Profile_Attendance;
