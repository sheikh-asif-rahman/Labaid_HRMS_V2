import React, { useState } from "react";
import "./Leave_Application.css";

const Leave_Application: React.FC = () => {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    purpose: "",
    alternativePerson: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Leave form data:", formData);
    alert("Leave application saved!");
  };

  const userInfo = {
    userId: "EMP12345",
    userName: "Asif Rahman",
    facility: "Head Office",
    department: "IT",
    designation: "Developer",
    dateOfJoining: "2022-01-15",
    leaveBalance: 15,
    leaveEnjoyed: 5,
    leaveRequired: 3,
  };

  return (
    <div className="leave-app-container">
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
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
            />
          </div>
          <div className="leave-app-group">
            <label>To Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
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
