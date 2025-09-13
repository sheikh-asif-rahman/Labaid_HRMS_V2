import React, { useState } from "react";
import "./User_Profile.css";

const User_Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    employeeId: "EMP001",
    name: "John Doe",
    branch: "Head Office",
    department: "IT",
    designation: "Software Engineer",
    personalPhone: "017XXXXXXXX",
    officialPhone: "018XXXXXXXX",
    joiningDate: "2020-01-10",
    resignDate: "",
    email: "john.doe@example.com",
    employeeType: "Full-time",
    gender: "Male",
    maritalStatus: "Single",
    bloodGroup: "O+",
    fatherName: "Mr. Doe",
    motherName: "Mrs. Doe",
    presentAddress: "Dhaka, Bangladesh",
    permanentAddress: "Chittagong, Bangladesh",
    nid: "1234567890",
    status: "Active",
    password: "********",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleUpdate = () => setIsEditing(false);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="upf-container">
      {/* Header */}
      <div className="upf-header">
        <h2>Profile</h2>
        {!isEditing ? (
          <button className="upf-edit-btn" onClick={handleEdit}>Edit</button>
        ) : (
          <button className="upf-update-btn" onClick={handleUpdate}>Update</button>
        )}
      </div>

      {/* Content */}
      <div className="upf-content">
        {/* Left column: profile pic */}
        <div className="upf-left">
          <label className="upf-pic-wrapper">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="upf-pic" />
            ) : (
              <div className="upf-placeholder">👤</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </label>
        </div>

        {/* Right column: form */}
        <div className="upf-right">
          <form className="upf-form">
            {Object.entries(formData).map(([key, value]) => (
              <div className="upf-form-group" key={key}>
                <label>
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </label>
                <input
                  type={key === "password" ? "password" : "text"}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default User_Profile;
