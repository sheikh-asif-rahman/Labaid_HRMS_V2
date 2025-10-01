import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./User_Profile.css";
import axios from "axios"; // <- added for API
import Popup from "../../Popup/Popup";

import { API_BASE_URL } from "../../../constants/apiBase"; // <- add your constants file path

interface OptionType {
  id: string | number;
  name: string;
}

interface FormDataType {
  employeeId: string;
  name: string;
  branch: string;
  departmentId: number | "";
  designationId: number | "";
  personalPhone: string;
  officialPhone: string;
  joiningDate: Date | null;
  resignDate: Date | null;
  email: string;
  employeeType: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  fatherName: string;
  motherName: string;
  presentAddress: string;
  permanentAddress: string;
  nid: string;
  status: string;
  password: string;
}

interface UserProfileProps {
  employeeData: any;
  showEditButton: boolean;
  onUpdate?: (updatedProfile: any) => void; // <-- add this
}

const User_Profile: React.FC<UserProfileProps> = ({
  employeeData,
  showEditButton,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [departments, setDepartments] = useState<OptionType[]>([]);
  const [designations, setDesignations] = useState<OptionType[]>([]);
  const [branches, setBranches] = useState<OptionType[]>([]);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: "loading" | "done" | "notdone";
    message: string;
  }>({
    isOpen: false,
    type: "loading",
    message: "",
  });

  const [specialPermissions, setSpecialPermissions] = useState<string[]>([]);

useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      const perms = parsed.Permission ? JSON.parse(parsed.Permission) : { Access: [], Special_Permission: [] };
      setSpecialPermissions(perms.Special_Permission || []);
    } catch (err) {
      console.error("Failed to parse permissions:", err);
      setSpecialPermissions([]);
    }
  }
}, []);


  const [formData, setFormData] = useState<FormDataType>({
    employeeId: "",
    name: "",
    branch: "",
    departmentId: "",
    designationId: "",
    personalPhone: "",
    officialPhone: "",
    joiningDate: null,
    resignDate: null,
    email: "",
    employeeType: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    fatherName: "",
    motherName: "",
    presentAddress: "",
    permanentAddress: "",
    nid: "",
    status: "",
    password: "",
  });

  const [dropdowns, setDropdowns] = useState({
    dept: false,
    des: false,
    empType: false,
    branch: false,
    gender: false,
    maritalStatus: false,
    bloodGroup: false,
    status: false,
  });

  const refs = {
    dept: useRef<HTMLDivElement>(null),
    des: useRef<HTMLDivElement>(null),
    empType: useRef<HTMLDivElement>(null),
    branch: useRef<HTMLDivElement>(null),
    gender: useRef<HTMLDivElement>(null),
    maritalStatus: useRef<HTMLDivElement>(null),
    bloodGroup: useRef<HTMLDivElement>(null),
    status: useRef<HTMLDivElement>(null),
  };

  const employeeTypes = [
    "Select Employee Type",
    "Full Time",
    "Contractual",
    "Part Time",
    "Others",
  ];
  const genderOptions = ["Select Gender", "Male", "Female", "Other"];
  const maritalStatusOptions = [
    "Select Marital Status",
    "Single",
    "Married",
    "Divorced",
    "Widowed",
  ];
  const bloodGroupOptions = [
    "Select Blood Group",
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];
  const statusOptions = ["Select Status", "Active", "Inactive", "Suspended"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(refs).forEach((key) => {
        const k = key as keyof typeof refs;
        if (
          refs[k].current &&
          !refs[k].current.contains(event.target as Node)
        ) {
          setDropdowns((prev) => ({ ...prev, [k]: false }));
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Departments
  useEffect(() => {
    axios.get(`${API_BASE_URL}getDepartmentList`).then((res) => {
      const data = res.data;
      if (data.success && Array.isArray(data.data)) {
        setDepartments(
          data.data
            .filter((d: any) => d.Status)
            .map((d: any) => ({ id: d.DepartmentID, name: d.DepartmentName }))
        );
      }
    });
  }, []);

  // Fetch Designations
  useEffect(() => {
    axios.get(`${API_BASE_URL}getDesignationList`).then((res) => {
      const data = res.data;
      if (data.success && Array.isArray(data.data)) {
        setDesignations(
          data.data
            .filter((d: any) => d.Status)
            .map((d: any) => ({ id: d.id, name: d.name }))
        );
      }
    });
  }, []);

  // Fetch Branches
  useEffect(() => {
    axios.get(`${API_BASE_URL}facilities`).then((res) => {
      const data = res.data;
      if (data.success && Array.isArray(data.data)) {
        setBranches(data.data.map((b: any) => ({ id: b.id, name: b.name })));
      }
    });
  }, []);

  // Populate formData when employeeData changes
  useEffect(() => {
    if (!employeeData) return;

    setFormData({
      employeeId: employeeData.EmployeeId || "",
      name: employeeData.EmployeeName || "",
      branch: branches.find((b) => b.id === employeeData.BranchId)?.name || "",
      departmentId: employeeData.DepartmentId || "",
      designationId: employeeData.DesignationId || "",
      personalPhone: employeeData.PersonalContactNumber || "",
      officialPhone: employeeData.OfficalContactNumber || "",
      joiningDate: employeeData.DateOfJoin
        ? new Date(employeeData.DateOfJoin)
        : null,
      resignDate: employeeData.DateOfResign
        ? new Date(employeeData.DateOfResign)
        : null,
      email: employeeData.Email || "",
      employeeType: employeeData.EmployeeType || "",
      gender: employeeData.Gender || "",
      maritalStatus: employeeData.MaritalStatus || "",
      bloodGroup: employeeData.BloodGroup || "",
      fatherName: employeeData.FatherName || "",
      motherName: employeeData.MotherName || "",
      presentAddress: employeeData.PresentAddress || "",
      permanentAddress: employeeData.PermanentAddress || "",
      nid: employeeData.NID || "",
      status: employeeData.Status || "Active",
      password: employeeData.Password || "",
    });
  }, [employeeData, branches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["personalPhone", "officialPhone", "nid"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (
    field: keyof FormDataType,
    value: any,
    dropdownKey: keyof typeof dropdowns
  ) => {
    // Update the form value
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Close the dropdown immediately after selection
    setDropdowns((prev) => ({ ...prev, [dropdownKey]: false }));
  };

  const handleEdit = () => setIsEditing(true);

  // ---------- UPDATED: handleUpdate with API call ----------
  const handleUpdate = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

const payload = {
  EmployeeId: formData.employeeId,
  UserId: loggedInUser.EmployeeId || "ADMIN",
  EmployeeName: formData.name,
  DepartmentId: String(formData.departmentId),
  DesignationId: String(formData.designationId),
  BranchId: String(
    branches.find((b) => b.name === formData.branch)?.id || ""
  ),
  DateOfJoin: formData.joiningDate
    ? formData.joiningDate.toISOString().split("T")[0]
    : null,
  DateOfResign: formData.resignDate
    ? formData.resignDate.toISOString().split("T")[0]
    : null,
  NID: formData.nid,
  PersonalContactNumber: formData.personalPhone,
  OfficalContactNumber: formData.officialPhone,
  Email: formData.email,
  EmployeeType: formData.employeeType,
  Gender: formData.gender,
  MaritalStatus: formData.maritalStatus,
  BloodGroup: formData.bloodGroup,
  FatherName: formData.fatherName,
  MotherName: formData.motherName,
  PresentAddress: formData.presentAddress,
  PermanentAddress: formData.permanentAddress,
  Status: formData.status,
  Password: formData.password,
  type: "profile",
};

      // Show loading popup
      setPopup({
        isOpen: true,
        type: "loading",
        message: "Updating profile...",
      });

      const response = await axios.put(
        `${API_BASE_URL}employeeupdate`,
        payload
      );
      console.log("Update Response:", response.data);

      // Success popup
      setPopup({
        isOpen: true,
        type: "done",
        message: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setPopup({
        isOpen: true,
        type: "notdone",
        message: "Failed to update profile",
      });
    }
  };

  // --------------------------------------------------------

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="upf-container">
<div className="upf-header">
  <h2>Profile</h2>

  {/* Show edit button only if user has the special permission */}
  {specialPermissions.includes("Can Access To Edit Employee Profile") && !isEditing && showEditButton && (
    <button className="upf-edit-btn" onClick={handleEdit}>Edit</button>
  )}

  {specialPermissions.includes("Can Access To Edit Employee Profile") && isEditing && (
    <button className="upf-update-btn" onClick={handleUpdate}>Update</button>
  )}
</div>


      <div className="upf-content">
        <div className="upf-left">
          <label className="upf-pic-wrapper">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="upf-pic" />
            ) : (
              <div className="upf-placeholder">
                <FaUserCircle size={80} color="#ccc" />
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
            )}
          </label>
        </div>

        <div className="upf-right">
          <form className="upf-form">
            {/* Employee ID */}
            <div className="upf-form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                disabled
              />
            </div>

            {/* Name */}
            <div className="upf-form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Branch Dropdown */}
            <div className="upf-form-group" ref={refs.branch}>
              <label>Branch</label>
              <div
                className={`custom-select ${dropdowns.branch ? "open" : ""}`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({ ...prev, branch: !prev.branch }))
                }
              >
                <div className="selected">
                  {formData.branch || "Select Branch"}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.branch && (
                  <div className="options">
                    {branches.map((b) => (
                      <div
                        key={b.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("branch", b.name, "branch");
                        }}
                      >
                        {b.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="upf-form-group" ref={refs.dept}>
              <label>Department</label>
              <div
                className={`custom-select ${dropdowns.dept ? "open" : ""}`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({ ...prev, dept: !prev.dept }))
                }
              >
                <div className="selected">
                  {formData.departmentId
                    ? departments.find((d) => d.id === formData.departmentId)
                        ?.name
                    : "Select..."}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.dept && (
                  <div className="options">
                    {departments.map((d) => (
                      <div
                        key={d.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("departmentId", d.id, "dept");
                        }}
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Designation Dropdown */}
            <div className="upf-form-group" ref={refs.des}>
              <label>Designation</label>
              <div
                className={`custom-select ${dropdowns.des ? "open" : ""}`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({ ...prev, des: !prev.des }))
                }
              >
                <div className="selected">
                  {formData.designationId
                    ? designations.find((d) => d.id === formData.designationId)
                        ?.name
                    : "Select..."}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.des && (
                  <div className="options">
                    {designations.map((d) => (
                      <div
                        key={d.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("designationId", d.id, "des");
                        }}
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Employee Type Dropdown */}
            <div className="upf-form-group" ref={refs.empType}>
              <label>Employee Type</label>
              <div
                className={`custom-select ${dropdowns.empType ? "open" : ""}`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({ ...prev, empType: !prev.empType }))
                }
              >
                <div className="selected">
                  {formData.employeeType || "Select Employee Type"}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.empType && (
                  <div className="options">
                    {employeeTypes.map((type, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("employeeType", type, "empType");
                        }}
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Joining Date */}
            <div className="upf-form-group">
              <label>Joining Date</label>
              <DatePicker
                selected={formData.joiningDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, joiningDate: date }))
                }
                dateFormat="yyyy-MM-dd"
                disabled={!isEditing}
                className="upf-input"
                placeholderText="Select joining date"
              />
            </div>

            {/* Resign Date */}
            <div className="upf-form-group">
              <label>Resign Date</label>
              <DatePicker
                selected={formData.resignDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, resignDate: date }))
                }
                dateFormat="yyyy-MM-dd"
                disabled={!isEditing}
                className="upf-input"
                placeholderText="Select resign date"
              />
            </div>

            {/* Gender */}
            <div className="upf-form-group" ref={refs.gender}>
              <label>Gender</label>
              <div
                className={`custom-select ${dropdowns.gender ? "open" : ""}`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({ ...prev, gender: !prev.gender }))
                }
              >
                <div className="selected">
                  {formData.gender || "Select Gender"}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.gender && (
                  <div className="options">
                    {genderOptions.map((g, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("gender", g, "gender");
                        }}
                      >
                        {g}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Marital Status */}
            <div className="upf-form-group" ref={refs.maritalStatus}>
              <label>Marital Status</label>
              <div
                className={`custom-select ${
                  dropdowns.maritalStatus ? "open" : ""
                }`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({
                    ...prev,
                    maritalStatus: !prev.maritalStatus,
                  }))
                }
              >
                <div className="selected">
                  {formData.maritalStatus || "Select Marital Status"}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.maritalStatus && (
                  <div className="options">
                    {maritalStatusOptions.map((m, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("maritalStatus", m, "maritalStatus");
                        }}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Blood Group */}
            <div className="upf-form-group" ref={refs.bloodGroup}>
              <label>Blood Group</label>
              <div
                className={`custom-select ${
                  dropdowns.bloodGroup ? "open" : ""
                }`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({
                    ...prev,
                    bloodGroup: !prev.bloodGroup,
                  }))
                }
              >
                <div className="selected">
                  {formData.bloodGroup || "Select Blood Group"}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.bloodGroup && (
                  <div className="options">
                    {bloodGroupOptions.map((b, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("bloodGroup", b, "bloodGroup");
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="upf-form-group" ref={refs.status}>
              <label>Status</label>
              <div
                className={`custom-select ${dropdowns.status ? "open" : ""}`}
                onClick={() =>
                  isEditing &&
                  setDropdowns((prev) => ({ ...prev, status: !prev.status }))
                }
              >
                <div className="selected">
                  {formData.status || "Select Status"}{" "}
                  <span style={{ float: "right" }}>▾</span>
                </div>
                {dropdowns.status && (
                  <div className="options">
                    {statusOptions.map((s, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect("status", s, "status");
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Other fields */}
            {Object.entries(formData).map(([key, value]) => {
              if (
                [
                  "employeeId",
                  "name",
                  "branch",
                  "departmentId",
                  "designationId",
                  "employeeType",
                  "joiningDate",
                  "resignDate",
                  "gender",
                  "maritalStatus",
                  "bloodGroup",
                  "status",
                ].includes(key)
              )
                return null;
              return (
                <div className="upf-form-group" key={key}>
                  <label>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())}
                  </label>
                  <input
                    type={
                      ["personalPhone", "officialPhone", "nid"].includes(key)
                        ? "number"
                        : key === "password"
                        ? "password"
                        : "text"
                    }
                    name={key}
                    value={value as string | number}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              );
            })}
          </form>
          <Popup
            isOpen={popup.isOpen}
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup({ ...popup, isOpen: false })}
          />
        </div>
      </div>
    </div>
  );
};

export default User_Profile;
