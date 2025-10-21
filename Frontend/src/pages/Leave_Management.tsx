import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants/apiBase";

import Leave_Application from "../components/Leave_Management/Leave_Application/Leave_Application";
import Leave_History from "../components/Leave_Management/Leave_History/Leave_History";
import Popup from "../components/Popup/Popup";

interface EmployeeData {
  EmployeeId: string;
  EmployeeName: string;
  DepartmentName: string;
  DesignationName: string;
  BranchName: string;
  DateOfJoin: string;
  LeaveEnjoyed: number;
  LeaveBalance: number;
}

interface LeaveHistoryItem {
  ApplicationId: string;
  EmployeeId: string;
  ApplicationDate: string;
  Purpose: string;
  TotalLeave: number;
  FromDate: string;
  ToDate: string;
  AlternativePerson: string;
}

const Leave_Management: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<LeaveHistoryItem[]>([]);
  const [dataFetched, setDataFetched] = useState(false); // track if data is ready

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) return;

        const { EmployeeId } = JSON.parse(user);

        // 1️⃣ Fetch Leave Form Data
        const formResponse = await axios.post(`${API_BASE_URL}leave-form-data`, { EmployeeId });
        if (formResponse.data.success && formResponse.data.data) {
          setEmployeeData(formResponse.data.data);
        }

        // 2️⃣ Fetch Leave History Data
        const historyResponse = await axios.post(`${API_BASE_URL}leave-history-data`, { EmployeeId });
        if (historyResponse.data.success && historyResponse.data.data) {
          setLeaveHistory(historyResponse.data.data);
        }

        // ✅ Only set dataFetched true if BOTH APIs succeeded
        if (
          formResponse.data.success &&
          formResponse.data.data &&
          historyResponse.data.success &&
          historyResponse.data.data
        ) {
          setDataFetched(true);
        }
      } catch (error) {
        // Do NOT set dataFetched true, popup will stay open
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Persistent Loading Popup */}
      <Popup
        isOpen={!dataFetched} // stays open until dataFetched === true
        type="loading"
      />

      {/* Leave Application */}
      {employeeData && <Leave_Application data={employeeData} />}

      {/* Leave History */}
      <Leave_History employeeData={employeeData} leaveHistoryData={leaveHistory} />
    </div>
  );
};

export default Leave_Management;
