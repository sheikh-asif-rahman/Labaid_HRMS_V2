import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./User_Profile_Attendance.css";

interface UserProfileAttendanceProps {
  punchInTime: string; // format "HH:mm", e.g., "09:00"
  totalShiftHours?: number; // default 8h
}

const User_Profile_Attendance: React.FC<UserProfileAttendanceProps> = ({
  punchInTime,
  totalShiftHours = 8,
}) => {
  const [workedHours, setWorkedHours] = useState<number>(0);

  // Calculate worked hours from punch-in time
  useEffect(() => {
    const calculateWorkedHours = () => {
      const now = new Date();
      const punchIn = new Date();
      const [h, m] = punchInTime.split(":").map(Number);
      punchIn.setHours(h, m, 0, 0);

      const diff = (now.getTime() - punchIn.getTime()) / (1000 * 60 * 60); // hours
      setWorkedHours(Math.min(diff, totalShiftHours));
    };

    calculateWorkedHours();
    const interval = setInterval(calculateWorkedHours, 60 * 1000); // update every minute

    return () => clearInterval(interval);
  }, [punchInTime, totalShiftHours]);

  const todayDate = new Date().toLocaleDateString();

  // Data for circular progress
  const data = [
    { name: "Worked", value: workedHours },
    { name: "Remaining", value: Math.max(totalShiftHours - workedHours, 0) },
  ];

  const COLORS = ["#4CAF50", "#E0E0E0"];

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
            innerRadius={40}  // smaller
            outerRadius={55}  // smaller
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
          <p className="total-hours-label">Total Hours</p>
          <p className="total-hours-value">
            {workedHours.toFixed(1)}h / {totalShiftHours}h
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
