import React, { useState } from "react";
import { FaCalendarAlt, FaChevronUp, FaChevronDown } from "react-icons/fa";
import "./Recent_Applications.css";

interface Application {
  date: string;
  message: string;
  status: "Approved" | "Rejected" | "Pending";
}

const applications: Application[] = [
  { date: "1 Jan", message: "Leave approved for medical reason.", status: "Approved" },
  { date: "2 Jan", message: "Leave request pending for personal work.", status: "Pending" },
  { date: "3 Jan", message: "Vacation leave rejected due to workload.", status: "Rejected" },
  { date: "4 Jan", message: "Transfer request approved by HR.", status: "Approved" },
  { date: "5 Jan", message: "Leave application for personal reason.", status: "Pending" },
  { date: "6 Jan", message: "Leave rejected due to incomplete form.", status: "Rejected" },
  { date: "7 Jan", message: "Leave approved for attending conference.", status: "Approved" },
  { date: "8 Jan", message: "Leave request pending for family event.", status: "Pending" },
  { date: "9 Jan", message: "Vacation leave rejected by manager.", status: "Rejected" },
  { date: "10 Jan", message: "Leave approved for health checkup.", status: "Approved" },
  { date: "11 Jan", message: "Leave request pending for personal reasons.", status: "Pending" },
  { date: "12 Jan", message: "Transfer request rejected by HR.", status: "Rejected" },
  { date: "13 Jan", message: "Leave approved for urgent work.", status: "Approved" },
  { date: "14 Jan", message: "Leave request pending for short trip.", status: "Pending" },
  { date: "15 Jan", message: "Vacation leave rejected due to high workload.", status: "Rejected" },
];

const VISIBLE_ROWS = 4;

const Recent_Applications: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  const handleUp = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleDown = () => {
    setStartIndex((prev) => Math.min(prev + 1, applications.length - VISIBLE_ROWS));
  };

  const visibleApps = applications.slice(startIndex, startIndex + VISIBLE_ROWS);

  return (
    <div className="recent-applications-container">
      {/* Header */}
      <div className="recent-applications-header d-flex justify-content-between align-items-center mb-2">
        <h5>
          Recent Applications <span className="unread-count">{applications.length}</span>
        </h5>
      </div>

      {/* Rows */}
      <div className="applications-table">
        <div className="applications-inner">
          {applications.map((app, index) => (
            <div
              className="application-row"
              key={index}
              style={{
                transform: `translateY(-${startIndex * 44}px)`, // slide rows
                transition: "transform 0.3s ease",
              }}
            >
              <div className="application-date">
                <FaCalendarAlt className="calendar-icon" />
                <span className="date-text">{app.date}</span>
              </div>

              <div className="application-message">{app.message}</div>

              <div className={`application-status ${app.status.toLowerCase()}`}>
                {app.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Up/Down buttons */}
      <div className="scroll-buttons">
        <button onClick={handleUp} disabled={startIndex === 0}>
          <FaChevronUp />
        </button>
        <button onClick={handleDown} disabled={startIndex >= applications.length - VISIBLE_ROWS}>
          <FaChevronDown />
        </button>
      </div>
    </div>
  );
};

export default Recent_Applications;
