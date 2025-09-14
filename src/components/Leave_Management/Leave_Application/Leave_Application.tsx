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
    department: "IT",
    designation: "Developer",
    dateOfJoining: "2022-01-15",
    leaveBalance: 15,
    leaveEnjoyed: 5,
    leaveRequired: 3,
  };

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h2>Leave Form</h2>
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>

      <div className="leave-form">
        <div className="form-row">
          <div className="form-group">
            <label>User ID</label>
            <input type="text" value={userInfo.userId} readOnly />
          </div>
          <div className="form-group">
            <label>User Name</label>
            <input type="text" value={userInfo.userName} readOnly />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input type="text" value={userInfo.department} readOnly />
          </div>
          <div className="form-group">
            <label>Designation</label>
            <input type="text" value={userInfo.designation} readOnly />
          </div>
          <div className="form-group">
            <label>Date of Joining</label>
            <input type="text" value={userInfo.dateOfJoining} readOnly />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Leave Balance</label>
            <input type="text" value={userInfo.leaveBalance} readOnly />
          </div>
          <div className="form-group">
            <label>Leave Enjoyed</label>
            <input type="text" value={userInfo.leaveEnjoyed} readOnly />
          </div>
          <div className="form-group">
            <label>Leave Required</label>
            <input type="text" value={userInfo.leaveRequired} readOnly />
          </div>
          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group large">
            <label>Purpose of Leave</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>
          <div className="form-group large">
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
