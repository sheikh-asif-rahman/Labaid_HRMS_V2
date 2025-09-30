import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./Overview_Cards.css";

interface Facility {
  deviceId: string;
  deviceName: string; // branch/facility name
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  leave?: number;
}

interface OverviewCardsProps {
  facilities: Facility[];
  userBranchName?: string; // user branch from profile API
}

const COLORS = ["#0115a9ff", "#9b59b6", "#ff3399", "#c5c5c5"];

const Overview_Cards: React.FC<OverviewCardsProps> = ({
  facilities,
  userBranchName,
}) => {
  return (
    <div className="overview-container">
      {facilities.map((facility) => {
        const leave = facility.leave ?? 0;
        const total = facility.totalEmployees;
        const attendance = facility.presentCount;
        const absent = facility.absentCount;
        const remaining = total - (attendance + absent + leave);

        const chartData = [
          { name: "Attendance", value: attendance },
          { name: "Leave", value: leave },
          { name: "Absent", value: absent },
          { name: "Remaining", value: remaining },
        ];

        // Highlight user's branch safely
        const isHighlighted =
          userBranchName &&
          facility.deviceName &&
          facility.deviceName.trim().toLowerCase() ===
            userBranchName.trim().toLowerCase();

        return (
          <div
            key={facility.deviceId}
            className={`overview-card ${
              isHighlighted ? "highlight-card my-facility" : ""
            }`}
          >
            <h3>{facility.deviceName}</h3>

            <div className="chart-wrapper">
              <PieChart width={120} height={120}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={2}
                >
                  {chartData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>

              <div className="chart-center">
                <span>{total}</span>
                <small>Total</small>
              </div>
            </div>

            <div className="legend-custom">
              <div>
                <span className="dot attendance"></span> Attendance: {attendance}
              </div>
              <div>
                <span className="dot on-leave"></span> Leave: {leave}
              </div>
              <div>
                <span className="dot absent"></span> Absent: {absent}
              </div>
              <div>
                <span className="dot gray"></span> Remaining: {remaining}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Overview_Cards;
