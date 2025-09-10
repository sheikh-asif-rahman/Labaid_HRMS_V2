import React from "react";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";

const Employee: React.FC = () => {
  return (
    <div className="p-6 flex justify-center">
      <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
    </div>
  );
};

export default Employee;
