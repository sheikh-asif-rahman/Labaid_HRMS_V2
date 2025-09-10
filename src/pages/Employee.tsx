import React from "react";
import Search from "../components/Search/Search";
import User_Profile_Attendance from "../components/Employee/User_Profile_Attendance/User_Profile_Attendance";

const Employee: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log("Search:", query);
  };

  const handleSave = () => console.log("Save clicked");
  const handleUpdate = () => console.log("Update clicked");
  const handleNew = () => console.log("New clicked");

  return (
    <div className="p-6">
      {/* Search component: Search + New initially, Save appears after clicking Search */}
      <Search
        placeholder="Search employees..."
        onSearch={handleSearch}
        onSave={handleSave}          // Save action
        onNew={handleNew}            // New action (always visible)
        showSaveOrUpdate="save"      // "save" or "update" button replaces search
      />

      {/* Attendance */}
      <div className="flex justify-center mt-6">
        <User_Profile_Attendance punchInTime="09:00" totalShiftHours={8} />
      </div>
    </div>
  );
};

export default Employee;
