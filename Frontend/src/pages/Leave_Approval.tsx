import React from "react";
import Leave_Approval from "../components/Leave_Management/Leave_Approval/Leave_Approval"; // adjust path if needed
import Popup from "../components/Popup/Popup";



const Leave_Approval_Page: React.FC = () => {
  return (
    <div>
      <Leave_Approval />
      <Popup isOpen={true} type="underdev" />

    </div>
  );
};

export default Leave_Approval_Page;
