import React from "react";
import "./Reports_Form.css";

type Props = {
  reportType: string;
  setReportType: (value: string) => void;
  dataFetched: boolean;
  setDataFetched: (value: boolean) => void;
};

const Reports_Form: React.FC<Props> = ({
  reportType,
  setReportType,
  dataFetched,
  setDataFetched,
}) => {
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
    <div className="reports-form-container">
      {/* Header */}
      <div className="reports-form-header">
        <h3 className="reports-form-title">Reports</h3>
        <select
          className="reports-form-dropdown"
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
      <div className="reports-form-options">
        <div className="reports-form-group">
          <label>Select Facility</label>
          <select disabled={!reportType}>
            <option value="">Select Facility</option>
            <option value="facility1">Facility 1</option>
            <option value="facility2">Facility 2</option>
          </select>
        </div>

        <div className="reports-form-group">
          <label>User ID (Optional)</label>
          <input
            type="text"
            placeholder="Enter User ID"
            disabled={!isGeneralReport}
          />
        </div>

        <div className="reports-form-group">
          <label>From Date</label>
          <input type="date" disabled={!isGeneralReport} />
        </div>

        <div className="reports-form-group">
          <label>To Date</label>
          <input type="date" disabled={!isGeneralReport} />
        </div>
      </div>

      {/* Buttons */}
      <div className="reports-form-buttons">
        {!dataFetched ? (
          <button
            className="reports-form-btn reports-form-btn-blue"
            onClick={handleGetData}
            disabled={!reportType}
          >
            Get Data
          </button>
        ) : (
          <>
            <button className="reports-form-btn reports-form-btn-blue">
              Download
            </button>
            <button
              className="reports-form-btn reports-form-btn-gray"
              onClick={handleReset}
            >
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports_Form;
