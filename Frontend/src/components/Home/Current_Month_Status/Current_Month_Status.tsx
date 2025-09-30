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

interface CurrentMonthStatusProps {
  data: {
    fullDay: number;
    halfDay: number;
    absent: number;
    leave: number;
  };
}

const Current_Month_Status: React.FC<CurrentMonthStatusProps> = ({ data }) => {
  return (
    <div className="current-month-status p-3">
      <h5 className="status-header mb-3">This Month Status</h5>
      <div className="status-cards-row d-flex">
        <StatusCard icon={<FaSun />} number={data.fullDay} title="Full Day" />
        <StatusCard icon={<FaCloudSun />} number={data.halfDay} title="Half Day" />
        <StatusCard icon={<FaTimesCircle />} number={data.absent} title="Absent" />
        <StatusCard icon={<FaUmbrellaBeach />} number={data.leave} title="Leave" />
      </div>
    </div>
  );
};

export default Current_Month_Status;
