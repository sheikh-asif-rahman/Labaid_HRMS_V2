import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // default icon
import "./Profile.css";

const Profile: React.FC = () => {
  const [profilePic] = useState<string | null>(null);

  return (
    <div className="profile-container">
      {/* Profile Picture */}
      <div className="profile-pic">
        {profilePic ? (
          <img src={profilePic} alt="User Profile" />
        ) : (
          <FaUserCircle className="default-icon" />
        )}
      </div>

      {/* User Name */}
      <h3 className="profile-name">John Doe</h3>

      <hr className="profile-divider" />

      {/* User Details */}
      <div className="profile-details">
        <p><span>User ID:</span> ADMIN</p>
        <p><span>Department:</span> IT</p>
        <p><span>Designation:</span> Executive</p>
        <p><span>Facility:</span> Head Office</p>
        <p><span>Shift:</span> Day</p>
        <p><span>Leave Balance:</span> 12 Days</p>
      </div>

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="password-btn">Change Password</button>
      </div>
    </div>
  );
};

export default Profile;
