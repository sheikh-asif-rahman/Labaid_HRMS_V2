// src/components/Recent_Applications/Recent_Applications.tsx
import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import "./Recent_Applications.css";

interface Application {
  date: string;
  type: string;
  reason: string;
  duration: string;
  totalDays: number;
  status: "Approved" | "Rejected" | "Pending";
}

const applications: Application[] = [
  {
    date: "12 Jun",
    type: "Leave",
    reason: "Medical",
    duration: "12 Jun - 14 Jun",
    totalDays: 3,
    status: "Approved",
  },
  {
    date: "5 May",
    type: "Leave",
    reason: "Personal",
    duration: "5 May - 5 May",
    totalDays: 1,
    status: "Pending",
  },
  {
    date: "20 Jun",
    type: "Leave",
    reason: "Vacation",
    duration: "20 Jun - 22 Jun",
    totalDays: 3,
    status: "Rejected",
  },
];

const Recent_Applications: React.FC = () => {
  return (
    <div className="recent-applications-container">
      {/* Header with Title and History */}
      <div className="recent-applications-header d-flex justify-content-between align-items-center mb-3">
        <h5>
          Recent Applications <span className="unread-count">2</span>
        </h5>
        <button className="history-button">History</button>
      </div>

      {/* Table */}
      <div className="applications-table">
        {applications.map((app, index) => (
          <div className="application-row d-flex align-items-center" key={index}>
            {/* Date Icon */}
            <div className="application-date d-flex align-items-center justify-content-center me-3">
              <FaCalendarAlt className="calendar-icon" />
              <span className="date-text">{app.date}</span>
            </div>

            {/* Type */}
            <div className="application-col">{app.type}</div>

            {/* Reason */}
            <div className="application-col">{app.reason}</div>

            {/* Duration */}
            <div className="application-col">{app.duration}</div>

            {/* Total Days */}
            <div className="application-col">{app.totalDays}</div>

            {/* Status */}
            <div className={`application-col status ${app.status.toLowerCase()}`}>
              {app.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recent_Applications;
