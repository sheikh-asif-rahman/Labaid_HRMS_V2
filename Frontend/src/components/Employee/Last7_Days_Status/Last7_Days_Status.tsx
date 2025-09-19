import React from "react";
import "./Last7_Days_Status.css";

interface DailyAttendance {
  day: string;
  hoursWorked: number; // 0 to 8
}

interface Last7_Days_StatusProps {
  data: DailyAttendance[];
}

const Last7_Days_Status: React.FC<Last7_Days_StatusProps> = ({ data }) => {
  return (
    <div className="last7_days_status_container">
      <h3 className="title">Last 7 Days Status</h3>
      <div className="attendance_list">
        {data.map((dayData) => {
          const percentage = (dayData.hoursWorked / 8) * 100;
          return (
            <div key={dayData.day} className="attendance_row">
              <div className="day_label">{dayData.day}</div>
              <div className="progress_bar">
                <div
                  className="progress_fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="hours_label">{dayData.hoursWorked}h</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Last7_Days_Status;
