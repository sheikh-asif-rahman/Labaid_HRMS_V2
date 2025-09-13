import React from "react";
import "./Report_Form.css";

type Props = {
  onSubmit: (formData: any) => void;
  buttonText?: string;
};

const EmployeeListReportForm: React.FC<Props> = ({ onSubmit, buttonText }) => {
  const handleClick = () => {
    onSubmit({ example: "employee list data" });
  };

  return (
    <div className="report-form">
      <label>Facility</label>
      <input type="text" placeholder="Enter Facility" />
      <button type="button" onClick={handleClick}>
        {buttonText || "Get Report"}
      </button>
    </div>
  );
};

export default EmployeeListReportForm;
