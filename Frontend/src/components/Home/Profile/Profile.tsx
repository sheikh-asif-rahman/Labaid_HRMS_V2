import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Popup from "../../Popup/Popup"; // Adjust path as needed
import "./Profile.css";

interface ProfileProps {
  data: {
    EmployeeName?: string;
    EmployeeId?: string;
    DepartmentName?: string;
    DesignationName?: string;
    BranchName?: string;
    Shift?: string;
    LeaveBalance?: number;
    ProfilePic?: string | null;
  };
}

const Profile: React.FC<ProfileProps> = ({ data }) => {
  const [profilePic] = useState<string | null>(data?.ProfilePic || null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="profile-container">
      <div className="profile-pic">
        {profilePic ? (
          <img src={profilePic} alt="User Profile" />
        ) : (
          <FaUserCircle className="default-icon" />
        )}
      </div>

      <h3 className="profile-name">{data?.EmployeeName || "John Doe"}</h3>
      <hr className="profile-divider" />

      <div className="profile-details">
        <p><span>User ID:</span> {data?.EmployeeId || "ADMIN"}</p>
        <p><span>Department:</span> {data?.DepartmentName || "N/A"}</p>
        <p><span>Designation:</span> {data?.DesignationName || "N/A"}</p>
        <p><span>Facility:</span> {data?.BranchName || "N/A"}</p>
        <p><span>Shift:</span> {data?.Shift || "N/A"}</p>
        <p><span>Leave Balance:</span> {data?.LeaveBalance ?? 0} Days</p>
      </div>

      <div className="profile-actions">
        <button className="password-btn" onClick={() => setIsPopupOpen(true)}>
          Change Password
        </button>
      </div>

      {/* Change Password Popup */}
      <Popup
        isOpen={isPopupOpen}
        type="changePassword"
        employeeId={data.EmployeeId}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
};

export default Profile;
