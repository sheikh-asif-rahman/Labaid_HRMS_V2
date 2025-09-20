import React, { useState } from "react";
import "./Rules_Permission.css";

type PermissionMap = Record<string, boolean>;

const Rules_Permission: React.FC = () => {
  // --- Data Sources ---
  const accessList = [
    "Overview",
    "Rules & Permission",
    "Leave Approval",
    "Designation Setup",
    "Department Setup",
    "Reports",
    "Employee",
    "Leave Management",
    "Yearly Calendar",
  ];

  const specialPermissions = [
    "Can Access Attendance Report",
    "Can Access Absent Report",
    "Can Access Leave Report",
    "Can Access Employee List",
    "Can Access To Edit Employee Profile",
    "Can Access to Upload Year Calendar Plan",
  ];

  const facilityAccess = [
    "Attendance Report",
    "Absent Report",
    "Leave Report",
    "Employee List",
    "Year Calendar Plan",
  ];

  // --- States ---
  const [access, setAccess] = useState<PermissionMap>(
    Object.fromEntries(accessList.map((item) => [item, false]))
  );

  const [special, setSpecial] = useState<PermissionMap>(
    Object.fromEntries(specialPermissions.map((item) => [item, false]))
  );

  const [facilities, setFacilities] = useState<PermissionMap>(
    Object.fromEntries(facilityAccess.map((item) => [item, false]))
  );

  // --- Toggle Handlers ---
  const toggleAccess = (key: string) =>
    setAccess((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSpecial = (key: string) =>
    setSpecial((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFacility = (key: string) =>
    setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  // --- Bulk Actions ---
  const checkAll = (list: string[], setter: React.Dispatch<React.SetStateAction<PermissionMap>>) =>
    setter(Object.fromEntries(list.map((i) => [i, true])));

  const uncheckAll = (list: string[], setter: React.Dispatch<React.SetStateAction<PermissionMap>>) =>
    setter(Object.fromEntries(list.map((i) => [i, false])));

  return (
    <div className="rules-permission-container">
      {/* Header */}
      <div className="rules-permission-header">
        <h2>Permission</h2>
        <button className="update-button">Update</button>
      </div>

      {/* User Info */}
      <div className="row">
        <div className="field">
          <label>User ID:</label>
          <input type="text" value="12345" readOnly />
        </div>
        <div className="field">
          <label>User Name:</label>
          <input type="text" value="John Doe" readOnly />
        </div>
      </div>

      {/* Access Section */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Access</h3>
          <div className="facility-buttons">
            <button onClick={() => checkAll(accessList, setAccess)}>Check All</button>
            <button onClick={() => uncheckAll(accessList, setAccess)}>Uncheck All</button>
          </div>
        </div>
        <div className="checkbox-group permission-group">
          {accessList.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={access[item]}
                onChange={() => toggleAccess(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Special Permission Section */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Special Permission</h3>
          <div className="facility-buttons">
            <button onClick={() => checkAll(specialPermissions, setSpecial)}>Check All</button>
            <button onClick={() => uncheckAll(specialPermissions, setSpecial)}>Uncheck All</button>
          </div>
        </div>
        <div className="checkbox-group permission-group">
          {specialPermissions.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={special[item]}
                onChange={() => toggleSpecial(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Facility Access Section */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Facility Access For Report</h3>
          <div className="facility-buttons">
            <button onClick={() => checkAll(facilityAccess, setFacilities)}>Check All</button>
            <button onClick={() => uncheckAll(facilityAccess, setFacilities)}>Uncheck All</button>
          </div>
        </div>
        <div className="checkbox-group facility-group">
          {facilityAccess.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={facilities[item]}
                onChange={() => toggleFacility(item)}
              />
              {item}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules_Permission;
