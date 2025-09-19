import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./Overview_Cards.css";

interface Facility {
  id: number;
  name: string;
  total: number;
  attendance: number;
  leave: number;
  absent: number;
}

// Updated COLORS according to your theme
const COLORS = ["#0115a9ff", "#9b59b6", "#ff3399", "#c5c5c5"]; 
// order: attendance, leave, absent, remaining

const Overview_Cards: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    const data: Facility[] = [
      { id: 1, name: "Facility 1", total: 100, attendance: 20, leave: 5, absent: 35 },
      { id: 2, name: "Facility 2", total: 120, attendance: 50, leave: 10, absent: 30 },
      { id: 3, name: "Facility 3", total: 80, attendance: 30, leave: 8, absent: 20 },
      { id: 4, name: "Facility 4", total: 150, attendance: 60, leave: 15, absent: 40 },
      { id: 5, name: "Facility 5", total: 90, attendance: 40, leave: 5, absent: 20 },
      { id: 6, name: "Facility 6", total: 110, attendance: 50, leave: 10, absent: 30 },
      { id: 7, name: "Facility 7", total: 95, attendance: 30, leave: 5, absent: 25 },
      { id: 8, name: "Facility 8", total: 130, attendance: 70, leave: 10, absent: 30 },
      { id: 9, name: "Facility 9", total: 85, attendance: 25, leave: 5, absent: 20 },
      { id: 10, name: "Facility 10", total: 120, attendance: 60, leave: 10, absent: 30 },
    ];
    setFacilities(data);
  }, []);

  return (
    <div className="overview-container">
      {facilities.map(facility => {
        const used = facility.attendance + facility.leave + facility.absent;
        const remaining = facility.total - used;

        const chartData = [
          { name: "Attendance", value: facility.attendance },
          { name: "Leave", value: facility.leave },
          { name: "Absent", value: facility.absent },
          { name: "Remaining", value: remaining },
        ];

        return (
          <div
            key={facility.id}
            className={`overview-card ${facility.id === 5 ? "my-facility" : ""}`}
          >
            <h3>{facility.name}</h3>

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
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>

              <div className="chart-center">
                <span>{facility.total}</span>
                <small>Total</small>
              </div>
            </div>

            <div className="legend-custom">
              <div><span className="dot attendance"></span> Attendance: {facility.attendance}</div>
              <div><span className="dot on-leave"></span> Leave: {facility.leave}</div>
              <div><span className="dot absent"></span> Absent: {facility.absent}</div>
              <div><span className="dot gray"></span> Remaining: {remaining}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Overview_Cards;
