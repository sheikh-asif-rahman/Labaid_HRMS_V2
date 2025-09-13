import React from "react";
import Search from "../components/Search/Search";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";
import User_Profile from "../components/Employee/User_Profile/User_Profile";

const Employee: React.FC = () => {
  const handleSearch = (query: string) => console.log("Search:", query);
  const handleNew = () => console.log("New clicked");

  return (
    <div className="p-6 flex flex-col items-center w-full">
      {/* Search component */}
      <div className="w-full max-w-6xl mb-6">
        <Search
          placeholder="Search employees..."
          onSearch={handleSearch}
          onNew={handleNew}
        />
      </div>

      {/* Row: Profile (70%) + Attendance (30%) */}
      <div className="w-full max-w-6xl flex flex-row gap-6 items-start">
        {/* Left column: Profile */}
        <div className="flex-[0_0_70%] p-2">
          <User_Profile />
        </div>

        {/* Right column: Attendance */}
        <div className="flex-[0_0_30%] p-2">
          <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
        </div>
      </div>
    </div>
  );
};

export default Employee;
