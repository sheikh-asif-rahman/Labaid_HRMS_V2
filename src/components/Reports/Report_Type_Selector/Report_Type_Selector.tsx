import React from "react";
import "./Report_Type_Selector.css";

type Props = {
  selectedReport: string;
  onChange: (value: string) => void;
};

const Report_Type_Selector: React.FC<Props> = ({ selectedReport, onChange }) => {
  return (
    <div className="report-type-selector">
      <label>Select Your Report</label>
      <select
        value={selectedReport}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="attendance">Attendance Report</option>
        <option value="leave">Leave Report</option>
        <option value="absent">Absent Report</option>
        <option value="employee-list">Employee List Report</option>
      </select>
    </div>
  );
};

export default Report_Type_Selector;
