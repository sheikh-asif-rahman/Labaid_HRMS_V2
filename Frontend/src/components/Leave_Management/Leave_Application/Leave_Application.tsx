import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Leave_Application.css";
import Popup from "../../Popup/Popup";
import axios from "axios";
import { API_BASE_URL } from "../../../constants/apiBase";

interface EmployeeData {
  EmployeeId: string;
  EmployeeName: string;
  DepartmentName: string;
  DesignationName: string;
  BranchName: string;
  DateOfJoin: string; // ISO string
  LeaveEnjoyed: number;
  LeaveBalance: number;
}

interface LeaveApplicationProps {
  data: EmployeeData;
}

const Leave_Application: React.FC<LeaveApplicationProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    fromDate: null as Date | null,
    toDate: null as Date | null,
    purpose: "",
    alternativePerson: "",
  });

  const [userInfo, setUserInfo] = useState({
    userId: "",
    userName: "",
    facility: "",
    department: "",
    designation: "",
    dateOfJoining: "",
    leaveBalance: 0,
    leaveEnjoyed: 0,
    leaveRequired: 0,
  });

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"done" | "notdone">("done");
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (data) {
      setUserInfo({
        userId: data.EmployeeId,
        userName: data.EmployeeName,
        facility: data.BranchName,
        department: data.DepartmentName,
        designation: data.DesignationName,
        dateOfJoining: data.DateOfJoin.split("T")[0],
        leaveBalance: data.LeaveBalance,
        leaveEnjoyed: data.LeaveEnjoyed,
        leaveRequired: 0,
      });
    }
  }, [data]);

  // Update LeaveRequired whenever fromDate or toDate changes
  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      if (formData.toDate < formData.fromDate) {
        setUserInfo((prev) => ({ ...prev, leaveRequired: 0 }));
        setPopupType("notdone");
        setPopupMessage("Invalid date range!!!");
        setPopupOpen(true);
      } else {
        const diff =
          (formData.toDate.getTime() - formData.fromDate.getTime()) /
          (1000 * 60 * 60 * 24) +
          1;
        setUserInfo((prev) => ({ ...prev, leaveRequired: Math.ceil(diff) }));
      }
    } else {
      setUserInfo((prev) => ({ ...prev, leaveRequired: 0 }));
    }
  }, [formData.fromDate, formData.toDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFromDateChange = (date: Date | null) => {
    setFormData({ ...formData, fromDate: date });
  };

  const handleToDateChange = (date: Date | null) => {
    setFormData({ ...formData, toDate: date });
  };

  const handleSave = async () => {
    if (!formData.fromDate || !formData.toDate || !formData.purpose) {
      setPopupType("notdone");
      setPopupMessage("Invalid Application!!");
      setPopupOpen(true);
      return;
    }

    if (formData.toDate < formData.fromDate) {
      setPopupType("notdone");
      setPopupMessage("Invalid date range!!");
      setPopupOpen(true);
      return;
    }

    const payload = {
      EmployeeId: userInfo.userId,
      Purpose: formData.purpose,
      TotalLeave: userInfo.leaveRequired,
      FromDate: formData.fromDate?.toISOString(),
      ToDate: formData.toDate?.toISOString(),
      AlternativePerson: formData.alternativePerson,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}save-leave-application`,
        payload
      );

      if (response.data.success) {
        setPopupType("done");
        setPopupMessage("Leave application saved successfully!");
      } else {
        setPopupType("notdone");
        setPopupMessage(response.data.message || "Failed to save leave application.");
      }
    } catch (error: any) {
      setPopupType("notdone");
      setPopupMessage(
        error?.response?.data?.message || "Failed to save leave application."
      );
    } finally {
      setPopupOpen(true);
    }
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    window.location.reload(); // reload page after popup closes
  };

  return (
    <div className="leave-app-container">
      <Popup
        isOpen={popupOpen}
        type={popupType}
        message={popupMessage}
        onClose={handlePopupClose}
      />

      <div className="leave-app-header">
        <h2>Leave Form</h2>
        <button className="leave-app-save-btn" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="leave-app-form">
        {/* Row 1 */}
        <div className="leave-app-row">
          <div className="leave-app-group">
            <label>User ID</label>
            <input type="text" value={userInfo.userId} readOnly />
          </div>
          <div className="leave-app-group">
            <label>User Name</label>
            <input type="text" value={userInfo.userName} readOnly />
          </div>
          <div className="leave-app-group">
            <label>Facility</label>
            <input type="text" value={userInfo.facility} readOnly />
          </div>
          <div className="leave-app-group">
            <label>Department</label>
            <input type="text" value={userInfo.department} readOnly />
          </div>
          <div className="leave-app-group">
            <label>Designation</label>
            <input type="text" value={userInfo.designation} readOnly />
          </div>
        </div>

        {/* Row 2 */}
        <div className="leave-app-row">
          <div className="leave-app-group">
            <label>Date of Joining</label>
            <input type="text" value={userInfo.dateOfJoining} readOnly />
          </div>
          <div className="leave-app-group">
            <label>Leave Enjoyed</label>
            <input type="text" value={userInfo.leaveEnjoyed} readOnly />
          </div>
          <div className="leave-app-group">
            <label>Leave Required</label>
            <input type="text" value={userInfo.leaveRequired} readOnly />
          </div>
          <div className="leave-app-group">
            <label>From Date</label>
            <DatePicker
              selected={formData.fromDate}
              onChange={handleFromDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select From Date"
            />
          </div>
          <div className="leave-app-group">
            <label>To Date</label>
            <DatePicker
              selected={formData.toDate}
              onChange={handleToDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select To Date"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="leave-app-row">
          <div className="leave-app-group small">
            <label>Leave Balance</label>
            <input type="text" value={userInfo.leaveBalance} readOnly />
          </div>
          <div className="leave-app-group large">
            <label>Purpose of Leave</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>
          <div className="leave-app-group medium">
            <label>Alternative Person</label>
            <input
              type="text"
              name="alternativePerson"
              value={formData.alternativePerson}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave_Application;
