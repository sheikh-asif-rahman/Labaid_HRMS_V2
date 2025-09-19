// src/components/Current_Month_Status/Current_Month_Status.tsx
import React from "react";
import { FaSun, FaCloudSun, FaTimesCircle, FaUmbrellaBeach } from "react-icons/fa";
import "./Current_Month_Status.css";

interface StatusCardProps {
  icon: React.ReactNode;
  number: number | string;
  title: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, number, title }) => {
  return (
    <div className="status-card d-flex align-items-center">
      <div className="status-icon d-flex align-items-center justify-content-center me-3">
        {icon}
      </div>
      <div className="status-text">
        <div className="status-number">{number}</div>
        <div className="status-title-small">{title}</div>
      </div>
    </div>
  );
};

const Current_Month_Status: React.FC = () => {
  return (
    <div className="current-month-status p-3">
      {/* Header for this section */}
      <h5 className="status-header mb-3">This Month Status</h5>

      <div className="status-cards-row d-flex">
        <StatusCard icon={<FaSun />} number={8} title="Full Day" />
        <StatusCard icon={<FaCloudSun />} number={2} title="Half Day" />
        <StatusCard icon={<FaTimesCircle />} number={1} title="Absent" />
        <StatusCard icon={<FaUmbrellaBeach />} number={1} title="Leave" />
      </div>
    </div>
  );
};

export default Current_Month_Status;
