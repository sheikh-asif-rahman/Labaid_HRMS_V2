import React from "react";
import "./Report_Form.css";

type Props = {
  onSubmit: (formData: any) => void;
  buttonText?: string;
};

const AbsentReportForm: React.FC<Props> = ({ onSubmit, buttonText }) => {
  const handleClick = () => {
    onSubmit({ example: "absent data" });
  };

  return (
    <div className="report-form">
      <label>Facility</label>
      <input type="text" placeholder="Enter Facility" />
      <label>User ID</label>
      <input type="text" placeholder="Enter User ID" />
      <label>From Date</label>
      <input type="date" />
      <label>To Date</label>
      <input type="date" />
      <button type="button" onClick={handleClick}>
        {buttonText || "Get Report"}
      </button>
    </div>
  );
};

export default AbsentReportForm;
