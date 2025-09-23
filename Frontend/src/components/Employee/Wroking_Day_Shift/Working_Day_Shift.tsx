import React, { useState, useEffect } from "react";
import "./Working_Day_Shift.css";

type Day = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
type DayType = "Full Day" | "Half Day" | "Off Day";

const days: Day[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const dayColors: Record<DayType, string> = {
  "Full Day": "#3b82f6", // blue
  "Half Day": "#facc15", // yellow
  "Off Day": "#9ca3af",  // gray
};

interface ShiftScheduleProps {
  shiftSchedule: string;
  onChange?: (updatedSchedule: string) => void; // optional callback for parent
}

// Parser to convert string into schedule object
const parseShiftSchedule = (shiftString: string) => {
  const schedule: Record<Day, { type: DayType }> = {
    Sat: { type: "Off Day" }, Sun: { type: "Off Day" }, Mon: { type: "Off Day" },
    Tue: { type: "Off Day" }, Wed: { type: "Off Day" }, Thu: { type: "Off Day" },
    Fri: { type: "Off Day" }
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
      NILL: "Off Day"
    };

    schedule[day] = { type: typeMap[typeStr.toUpperCase()] || "Off Day" };
  });

  return schedule;
};

// Helper to convert schedule object back to string
const scheduleToString = (schedule: Record<Day, { type: DayType }>) => {
  return days
    .map(day => {
      const typeMap: Record<DayType, string> = {
        "Full Day": "FULLDAY",
        "Half Day": "HALFDAY",
        "Off Day": "OFFDAY"
      };
      return `${day.toUpperCase()}[${typeMap[schedule[day].type]}]`;
    })
    .join(",");
};

const Working_Day_Shift: React.FC<ShiftScheduleProps> = ({ shiftSchedule, onChange }) => {
  const [schedule, setSchedule] = useState(parseShiftSchedule(shiftSchedule));
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [dayType, setDayType] = useState<DayType>("Full Day");

  useEffect(() => {
    const parsed = parseShiftSchedule(shiftSchedule);
    setSchedule(parsed);
  }, [shiftSchedule]);

  const handleDayClick = (day: Day) => {
    setActiveDay(day);
    setDayType(schedule[day].type);
  };

  const handleUpdate = () => {
    if (!activeDay) return;
    const updatedSchedule = {
      ...schedule,
      [activeDay]: { type: dayType },
    };
    setSchedule(updatedSchedule);

    // Send updated string to parent if callback provided
    if (onChange) {
      onChange(scheduleToString(updatedSchedule));
    }
  };

  const getCardColor = (day: Day) => {
    if (activeDay === day) return "#22c55e"; // green for active
    return dayColors[schedule[day].type];
  };

  return (
    <div className="working-day-shift-container">
      <div className="top-row">
        <div className="working-days-title">Working Days</div>
        <button className="update-btn" onClick={handleUpdate}>Update</button>
      </div>

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

      <div className="dropdowns-container">
        <select
          disabled={!activeDay}
          value={activeDay ? dayType : ""}
          onChange={(e) => setDayType(e.target.value as DayType)}
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
