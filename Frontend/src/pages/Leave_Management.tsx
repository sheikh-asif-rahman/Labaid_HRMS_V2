import React from "react";
import Leave_Application from "../components/Leave_Management/Leave_Application/Leave_Application"; 
import Leave_History from "../components/Leave_Management/Leave_History/Leave_History"; 
import Popup from "../components/Popup/Popup";

const Leave_Management: React.FC = () => {

  return (
    <div style={{ padding: "20px" }}>

      {/* Space */}
      <div style={{ height: "20px" }} />

      {/* Leave Application form */}
      <Leave_Application />

      {/* Space */}
      <div style={{ height: "20px" }} />

      {/* Leave History table */}
      <Leave_History />

      <Popup isOpen={true} type="underdev" />

    </div>
  );
};

export default Leave_Management;
