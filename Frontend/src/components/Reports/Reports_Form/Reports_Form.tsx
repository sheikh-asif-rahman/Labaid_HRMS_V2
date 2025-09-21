import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const handleReportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    setDataFetched(false);
    setFromDate(null);
    setToDate(null);
  };

  const handleGetData = () => setDataFetched(true);

  const handleReset = () => {
    setReportType("");
    setDataFetched(false);
    setFromDate(null);
    setToDate(null);
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
          <DatePicker
            selected={fromDate}
            onChange={(date: Date | null) => setFromDate(date)}
            disabled={!isGeneralReport}
            placeholderText="Select From Date"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="reports-form-group">
          <label>To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date: Date | null) => setToDate(date)}
            disabled={!isGeneralReport}
            placeholderText="Select To Date"
            dateFormat="yyyy-MM-dd"
            minDate={fromDate || undefined} // Prevent selecting a date before "From Date"
          />
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
