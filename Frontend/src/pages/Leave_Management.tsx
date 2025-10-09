import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants/apiBase";

import Leave_Application from "../components/Leave_Management/Leave_Application/Leave_Application";
import Leave_History from "../components/Leave_Management/Leave_History/Leave_History";

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
  EmployeeId: string;
  ApplicationDate: string;
  Purpose: string;
  TotalLeave: number;
  FromDate: string;
  ToDate: string;
  AlternativePerson: string;
  Status: "Approved" | "Rejected" | "Pending";
}

const Leave_Management: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
  const [leaveHistory, setLeaveHistory] = useState<LeaveHistoryItem[]>([]);

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          console.warn("⚠️ No user found in localStorage");
          return;
        }

        const { EmployeeId } = JSON.parse(user);
        console.log("📩 Hitting API with EmployeeId:", EmployeeId);

        // 1️⃣ Fetch Leave Form Data
        const formResponse = await axios.post(`${API_BASE_URL}leave-form-data`, { EmployeeId });
        console.log("✅ Leave Form Data:", formResponse.data);

        if (formResponse.data.success && formResponse.data.data) {
          setEmployeeData(formResponse.data.data);
        }

        // 2️⃣ Fetch Leave History Data
        const historyResponse = await axios.post(`${API_BASE_URL}leave-history-data`, { EmployeeId });
        console.log("📜 Leave History Data:", historyResponse.data);

        if (historyResponse.data.success && historyResponse.data.data) {
          setLeaveHistory(historyResponse.data.data);
        }
      } catch (error: any) {
        console.error("❌ Error fetching leave data:", error.message);
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* Space */}
      <div style={{ height: "20px" }} />

      {/* Leave Application form */}
      {employeeData ? (
        <Leave_Application data={employeeData} />
      ) : (
        <p>Loading leave form data...</p>
      )}

      {/* Space */}
      <div style={{ height: "20px" }} />

      {/* Leave History table */}
      <Leave_History
  employeeData={employeeData}
  leaveHistoryData={leaveHistory}
/>


      {/* <Popup isOpen={true} type="underdev" /> */}
    </div>
  );
};

export default Leave_Management;
