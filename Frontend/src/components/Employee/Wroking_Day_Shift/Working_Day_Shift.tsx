import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Working_Day_Shift.css";
import Popup from "../../Popup/Popup";
import { API_BASE_URL } from "../../../constants/apiBase";

type Day = "Sat" | "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
type DayType = "Full Day" | "Half Day" | "Off Day";

const days: Day[] = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

const dayColors: Record<DayType, string> = {
  "Full Day": "#3b82f6",
  "Half Day": "#facc15",
  "Off Day": "#9ca3af",
};

interface ShiftScheduleProps {
  shiftSchedule: string;
  employeeId: string;
  onChange?: (updatedSchedule: string) => void;
}

// parse "SAT[FULLDAY]" string into state
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
    const [, dayStr, typeStr] = match;
    const day = (dayStr.charAt(0) + dayStr.slice(1).toLowerCase()) as Day;
    const typeMap: Record<string, DayType> = {
      FULLDAY: "Full Day",
      HALFDAY: "Half Day",
      OFFDAY: "Off Day",
      NILL: "Off Day",
    };
    if (schedule[day]) schedule[day] = { type: typeMap[typeStr.toUpperCase()] || "Off Day" };
  });

  return schedule;
};

// convert back to "SAT[FULLDAY],SUN[OFFDAY]" string
const scheduleToString = (schedule: Record<Day, { type: DayType }>) => {
  const typeMap: Record<DayType, string> = {
    "Full Day": "FULLDAY",
    "Half Day": "HALFDAY",
    "Off Day": "OFFDAY",
  };
  return days.map((day) => `${day.toUpperCase()}[${typeMap[schedule[day].type]}]`).join(",");
};

const Working_Day_Shift: React.FC<ShiftScheduleProps> = ({ shiftSchedule, employeeId }) => {
  const [schedule, setSchedule] = useState(parseShiftSchedule(shiftSchedule));
  const [activeDay, setActiveDay] = useState<Day | null>(null);
  const [dayType, setDayType] = useState<DayType>("Full Day");
  const [specialPermissions, setSpecialPermissions] = useState<string[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
const [popupType, setPopupType] = useState<"loading" | "notdone" | "done">("loading");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const perms = parsed.Permission ? JSON.parse(parsed.Permission) : { Access: [], Special_Permission: [] };
        setSpecialPermissions(perms.Special_Permission || []);
      } catch (err) {
        console.error("Failed to parse permissions:", err);
      }
    }
  }, []);

  useEffect(() => {
    setSchedule(parseShiftSchedule(shiftSchedule));
  }, [shiftSchedule]);

  const handleDayClick = (day: Day) => {
    setActiveDay(day);
    setDayType(schedule[day].type);
  };

  const handleDayTypeChange = (newType: DayType) => {
    if (!activeDay) return;
    setSchedule((prev) => ({ ...prev, [activeDay]: { type: newType } }));
    setDayType(newType);
  };


const handleUpdate = async () => {
  if (!specialPermissions.includes("Can Access To Edit Employee Profile")) {
    setPopupType("notdone");
    setPopupMessage("You don't have permission to edit employee profile.");
    setPopupOpen(true);
    return;
  }

  const rawUser = localStorage.getItem("user");
  let userObj: any = {};
  try {
    if (rawUser) userObj = JSON.parse(rawUser);
  } catch {}

  const userId = (userObj?.UserId || userObj?.EmployeeId || "ADMIN").toString();
  const scheduleString = scheduleToString(schedule);

  const payload = {
    EmployeeId: String(employeeId),
    UserId: userId,
    ShiftSchedule: scheduleString,
    type: "shift",
  };

  console.log("🛰️ PUT payload:", payload);

  const endpoint = `${API_BASE_URL}employeeupdate`;

  // Show loading popup only once
  setPopupType("loading");
  setPopupMessage("Updating shift schedule...");
  setPopupOpen(true);

  try {
    const response = await axios.put(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });

    console.log("PUT success:", response.status, response.data);

    // Update same popup (don’t reopen)
    setPopupType("done");
    setPopupMessage(" Shift schedule updated successfully.");
  } catch (error: any) {
    console.error("❌ PUT failed:", error.response?.data || error.message);
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Failed to update shift schedule";

    // Update same popup (don’t reopen)
    setPopupType("notdone");
    setPopupMessage(`❌ ${msg}`);
  }
};


  const getCardColor = (day: Day) => {
    if (activeDay === day) return "#22c55e";
    return dayColors[schedule[day].type];
  };

  return (
    <div className="working-day-shift-container">
      <div className="top-row">
        <div className="working-days-title">Working Days</div>
        {specialPermissions.includes("Can Access To Edit Employee Profile") && (
          <button className="update-btn" onClick={handleUpdate}>Update</button>
        )}
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
          onChange={(e) => handleDayTypeChange(e.target.value as DayType)}
        >
          {!activeDay && <option value="">Select Day Type</option>}
          <option value="Full Day">Full Day</option>
          <option value="Half Day">Half Day</option>
          <option value="Off Day">Off Day</option>
        </select>
      </div>

      <Popup
        isOpen={popupOpen}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  );
};

export default Working_Day_Shift;
