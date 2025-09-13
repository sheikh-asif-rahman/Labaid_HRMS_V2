import React, { useState } from "react";
import "./Reports_Form.css";

const Reports_Form: React.FC = () => {
  const [reportType, setReportType] = useState<string>("");
  const [dataFetched, setDataFetched] = useState(false);

  const handleReportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    setDataFetched(false);
  };

  const handleGetData = () => setDataFetched(true);
  const handleReset = () => {
    setReportType("");
    setDataFetched(false);
  };

  const isGeneralReport =
    reportType === "attendance" ||
    reportType === "absent" ||
    reportType === "leave";

  return (
    <div className="report-form-container">
      {/* Header */}
      <div className="report-header">
        <h3 className="report-title">Reports</h3>
        <select
          className="report-dropdown"
          value={reportType}
          onChange={handleReportChange}
        >
          <option value="">Select Report Type</option>
          <option value="attendance">Attendance Report</option>
          <option value="absent">Absent Report</option>
          <option value="leave">Leave Report</option>
          <option value="employee">Employee List</option>
        </select>
      </div>

      {/* Options Section */}
      <div className="report-options">
        <div className="form-group">
          <label>Select Facility</label>
          <select disabled={!reportType}>
            <option value="">Select Facility</option>
            <option value="facility1">Facility 1</option>
            <option value="facility2">Facility 2</option>
          </select>
        </div>

        <div className="form-group">
          <label>User ID (Optional)</label>
          <input type="text" placeholder="Enter User ID" disabled={!isGeneralReport} />
        </div>

        <div className="form-group">
          <label>From Date</label>
          <input type="date" disabled={!isGeneralReport} />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input type="date" disabled={!isGeneralReport} />
        </div>
      </div>

      {/* Buttons */}
      <div className="report-buttons">
        {!dataFetched ? (
          <button
            className="btn btn-blue"
            onClick={handleGetData}
            disabled={!reportType}
          >
            Get Data
          </button>
        ) : (
          <>
            <button className="btn btn-blue">Download</button>
            <button className="btn btn-gray" onClick={handleReset}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports_Form;
