import React, { useState } from "react";
import { FaCalendarAlt, FaChevronUp, FaChevronDown } from "react-icons/fa";
import "./Recent_Applications.css";

interface Application {
  date: string;
  message: string;
  status: "Approved" | "Rejected" | "Pending";
}

interface RecentApplicationsProps {
  data: Application[] | null;
}

const VISIBLE_ROWS = 4;
const ROW_HEIGHT = 44; // height of one row in px

const Recent_Applications: React.FC<RecentApplicationsProps> = ({ data }) => {
  const applications = data || [];
  const [startIndex, setStartIndex] = useState(0);

  const handleUp = () => setStartIndex((prev) => Math.max(prev - 1, 0));
  const handleDown = () =>
    setStartIndex((prev) => Math.min(prev + 1, applications.length - VISIBLE_ROWS));

  const visibleApps = applications.slice(startIndex, startIndex + VISIBLE_ROWS);

  return (
    <div className="recent-applications-container">
      {/* Header */}
      <div className="recent-applications-header d-flex justify-content-between align-items-center mb-2">
        <h5>
          Recent Applications{" "}
          {applications.length > 0 && (
            <span className="unread-count">{applications.length}</span>
          )}
        </h5>
      </div>

      {/* Empty state */}
      {applications.length === 0 ? (
        <div
          className="empty-state"
          style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          No recent applications found.
        </div>
      ) : (
        <>
          {/* Rows */}
          <div className="applications-table" style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}px`, overflow: "hidden" }}>
            <div className="applications-inner">
              {visibleApps.map((app, index) => (
                <div
                  className="application-row"
                  key={index}
                  style={{
                    transform: `translateY(-${startIndex * ROW_HEIGHT}px)`,
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
            <button
              onClick={handleDown}
              disabled={startIndex >= applications.length - VISIBLE_ROWS}
            >
              <FaChevronDown />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Recent_Applications;
