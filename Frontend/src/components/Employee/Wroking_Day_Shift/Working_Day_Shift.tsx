import React, { useState, useEffect } from "react";
import "./Working_Day_Shift.css";

type Day = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
type DayType = "Full Day" | "Half Day" | "Off Day";

const days: Day[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const dayColors: Record<DayType, string> = {
  "Full Day": "#3b82f6",  // Blue
  "Half Day": "#facc15",  // Yellow
  "Off Day": "#9ca3af",   // Gray
};

interface ShiftScheduleProps {
  shiftSchedule: string; // e.g., "SAT[FULLDAY],SUN[HALFDAY]"
  employeeId?: string;   // optional, for API updates
  onChange?: (updatedSchedule: string) => void;
}

// Parse string like "SAT[FULLDAY],SUN[HALFDAY]" into state
const parseShiftSchedule = (shiftString: string) => {
  const schedule: Record<Day, { type: DayType }> = {
    Sat: { type: "Off Day" },
    Sun: { type: "Off Day" },
    Mon: { type: "Off Day" },
    Tue: { type: "Off Day" },
    Wed: { type: "Off Day" },
    Thu: { type: "Off Day" },
    Fri: { type: "Off Day" },
  };

  if (!shiftString) return schedule;

  const entries = shiftString.match(/[A-Z]+\[[^\]]+\]/g);
  if (!entries) return schedule;

  entries.forEach((entry) => {
    const match = entry.match(/^([A-Z]+)\[([^\]]+)\]$/);
    if (!match) return;
    const [_, dayStr, typeStr] = match;
    const day = (dayStr.charAt(0) + dayStr.slice(1).toLowerCase()) as Day;
    const typeMap: Record<string, DayType> = {
      FULLDAY: "Full Day",
      HALFDAY: "Half Day",
      OFFDAY: "Off Day",
      NILL: "Off Day",
    };
    schedule[day] = { type: typeMap[typeStr.toUpperCase()] || "Off Day" };
  });

  return schedule;
};

// Convert schedule state back to string for API
const scheduleToString = (schedule: Record<Day, { type: DayType }>) => {
  const typeMap: Record<DayType, string> = {
    "Full Day": "FULLDAY",
    "Half Day": "HALFDAY",
    "Off Day": "OFFDAY",
  };
  return days.map(day => `${day.toUpperCase()}[${typeMap[schedule[day].type]}]`).join(",");
};

const Working_Day_Shift: React.FC<ShiftScheduleProps> = ({ shiftSchedule, employeeId, onChange }) => {
  const [schedule, setSchedule] = useState(parseShiftSchedule(shiftSchedule));
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [dayType, setDayType] = useState<DayType>("Full Day");

  const [specialPermissions, setSpecialPermissions] = useState<string[]>([]);

useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      const perms = parsed.Permission ? JSON.parse(parsed.Permission) : { Access: [], Special_Permission: [] };
      setSpecialPermissions(perms.Special_Permission || []);
    } catch (err) {
      console.error("Failed to parse permissions:", err);
      setSpecialPermissions([]);
    }
  }
}, []);



  useEffect(() => {
    setSchedule(parseShiftSchedule(shiftSchedule));
  }, [shiftSchedule]);

  // Clicking a day highlights it and sets the dropdown
  const handleDayClick = (day: Day) => {
    setActiveDay(day);
    setDayType(schedule[day].type);
  };

  // Dropdown change updates schedule immediately
  const handleDayTypeChange = (newType: DayType) => {
    if (!activeDay) return;

    setSchedule(prev => ({
      ...prev,
      [activeDay]: { type: newType }
    }));

    setDayType(newType);
  };

  // Update button propagates current schedule to parent
  const handleUpdate = () => {
    if (onChange) {
      onChange(scheduleToString(schedule));
    }
  };

  const getCardColor = (day: Day) => {
    if (activeDay === day) return "#22c55e"; // active day green
    return dayColors[schedule[day].type];
  };

  return (
    <div className="working-day-shift-container">
<div className="top-row">
  <div className="working-days-title">Working Days</div>

  {/* Only show Update if user has permission */}
  {specialPermissions.includes("Can Access To Edit Employee Profile") && (
    <button className="update-btn" onClick={handleUpdate}>Update</button>
  )}
</div>


      <div className="days-container">
        {days.map(day => (
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

      <div className="dropdowns-container">
        <select
          disabled={!activeDay}
          value={activeDay ? dayType : ""}
          onChange={(e) => handleDayTypeChange(e.target.value as DayType)}
        >
          {!activeDay && <option value="">Select Day Type</option>}
          <option value="Full Day">Full Day</option>
          <option value="Half Day">Half Day</option>
          <option value="Off Day">Off Day</option>
        </select>
      </div>
    </div>
  );
};

export default Working_Day_Shift;
