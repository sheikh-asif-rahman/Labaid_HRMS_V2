import React, { useState } from "react";
import "./Working_Day_Shift.css";

type Day = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
type DayType = "Full Day" | "Half Day" | "Off Day";

const days: Day[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

// Default schedule for colors
const defaultSchedule: Record<Day, DayType> = {
  Sat: "Full Day",
  Sun: "Full Day",
  Mon: "Full Day",
  Tue: "Full Day",
  Wed: "Full Day",
  Thu: "Half Day",
  Fri: "Off Day",
};

const dayColors: Record<DayType, string> = {
  "Full Day": "#3b82f6", // blue
  "Half Day": "#facc15", // yellow
  "Off Day": "#9ca3af",  // gray
};

const timeOptions = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const Working_Day_Shift: React.FC = () => {
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [dayType, setDayType] = useState<DayType>("Full Day");
  const [fromTime, setFromTime] = useState<string>("09:00 AM");
  const [toTime, setToTime] = useState<string>("05:00 PM");

  const handleDayClick = (day: Day) => {
    setActiveDay(day);
    setDayType(defaultSchedule[day]);
    setFromTime("09:00 AM");
    setToTime("05:00 PM");
  };

  const getCardColor = (day: Day) => {
    if (activeDay === day) return "#22c55e"; // green for active
    return dayColors[defaultSchedule[day]]; // default color always visible
  };

  return (
    <div className="working-day-shift-container">
      {/* Top Row */}
      <div className="top-row">
        <div className="working-days-title">Working Days</div>
        <button className="update-btn">Update</button>
      </div>

      {/* Day Cards */}
      <div className="days-container">
        {days.map((day) => (
          <div
            key={day}
            className="day-card"
            style={{ backgroundColor: getCardColor(day) }}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dropdowns */}
      <div className="dropdowns-container">
        <select
          disabled={!activeDay} // disabled if no card clicked
          value={activeDay ? dayType : ""}
          onChange={(e) => setDayType(e.target.value as DayType)}
        >
          {!activeDay && <option value="">Select Day Type</option>}
          <option value="Full Day">Full Day</option>
          <option value="Half Day">Half Day</option>
          <option value="Off Day">Off Day</option>
        </select>

        <div className="time-dropdowns">
          <select
            disabled={!activeDay || dayType === "Off Day"}
            value={activeDay ? fromTime : ""}
            onChange={(e) => setFromTime(e.target.value)}
          >
            {!activeDay && <option value="">From</option>}
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select
            disabled={!activeDay || dayType === "Off Day"}
            value={activeDay ? toTime : ""}
            onChange={(e) => setToTime(e.target.value)}
          >
            {!activeDay && <option value="">To</option>}
            {timeOptions.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Working_Day_Shift;
