import React, { useState } from "react";
import "./Yearly_Calender.css";
import "../Search/search.css"; // reuse button styles

interface Event {
  date: number;
  month: number; // 0 = Jan
  type: "govt" | "weekend" | "special";
  name: string;
}

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

// Sample events
const sampleEvents: Event[] = [
  { date: 1, month: 0, type: "govt", name: "New Year Holiday" },
  { date: 15, month: 0, type: "special", name: "Team Meeting" },
  { date: 20, month: 1, type: "govt", name: "Government Holiday" },
  { date: 25, month: 1, type: "special", name: "Project Deadline" },
  { date: 5, month: 2, type: "weekend", name: "Weekend" },
  // Add more events here
];

// Helper: get number of days in month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const Yearly_Calender: React.FC = () => {
  const [year, setYear] = useState<number>(2025);
  const [activeMonth, setActiveMonth] = useState<number>(new Date().getMonth());

  const handlePrevYear = () => setYear(prev => prev - 1);
  const handleNextYear = () => setYear(prev => prev + 1);
  const handleMonthClick = (month: number) => setActiveMonth(month);

  // Filter events for active month
  const activeMonthEvents = sampleEvents.filter(e => e.month === activeMonth);

  const getDateColor = (date: number, month: number) => {
    const event = sampleEvents.find(e => e.date === date && e.month === month);
    if (!event) return "";
    if (event.type === "govt") return "red";
    if (event.type === "weekend") return "yellow";
    if (event.type === "special") return "green";
    return "";
  };

  return (
    <div className="yearly-calender-container">
      {/* Header */}
      <div className="calender-header">
        <h2 className="calender-title">Yearly Planning</h2>
        <div className="calender-actions">
          <button className="button search-button">Download</button>
          <button className="button new-button">Upload</button>
        </div>
      </div>

      {/* Main Row */}
      <div className="calender-main-row">
        {/* Left: Year Overview with mini calendars */}
        <div className="year-overview bordered-container">
          <div className="year-navigation">
            <button className="year-nav-btn" onClick={handlePrevYear}>&lt; Previous</button>
            <span>{year}</span>
            <button className="year-nav-btn" onClick={handleNextYear}>Next &gt;</button>
          </div>

          <div className="months-grid">
            {months.map((month, idx) => (
              <div
                key={idx}
                className={`month-card ${activeMonth === idx ? "active" : ""}`}
                onClick={() => handleMonthClick(idx)}
              >
                <div className="month-name">{month}</div>
                <div className="mini-calendar-grid">
                  {Array.from({ length: getDaysInMonth(year, idx) }, (_, i) => i + 1).map(day => (
                    <div
                      key={day}
                      className={`mini-calendar-day ${getDateColor(day, idx)}`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active Month Details */}
        <div className="active-month-container bordered-container">
          <h3>{months[activeMonth]} {year}</h3>

          {/* Active month events with dynamic height */}
          <div
            className="active-month-card"
            style={{
              height: `${Math.min(100 + activeMonthEvents.length * 20, 300)}px`
            }}
          >
            <ul className="event-list">
              {activeMonthEvents.map((event, idx) => (
                <li key={idx}>{event.date} - {event.name}</li>
              ))}
            </ul>
          </div>

          {/* Vertical Legend */}
          <div className="legend vertical-legend">
            <div className="legend-line">
              <div className="legend-item red"></div>
              <span>Government Holiday</span>
            </div>
            <div className="legend-line">
              <div className="legend-item yellow"></div>
              <span>Weekend</span>
            </div>
            <div className="legend-line">
              <div className="legend-item green"></div>
              <span>Special Day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yearly_Calender;
