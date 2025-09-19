import React, { useState } from "react";
import "./Rules_Permission.css";

type PermissionKeys = "a" | "b" | "c" | "d" | "e";

const Rules_Permission: React.FC = () => {
  const [permissions, setPermissions] = useState<Record<PermissionKeys, boolean>>({
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
  });

  const [facilities, setFacilities] = useState<Record<PermissionKeys, boolean>>({
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
  });

  const handlePermissionChange = (key: PermissionKeys) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFacilityChange = (key: PermissionKeys) => {
    setFacilities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checkAllFacilities = () => {
    setFacilities({ a: true, b: true, c: true, d: true, e: true });
  };

  const uncheckAllFacilities = () => {
    setFacilities({ a: false, b: false, c: false, d: false, e: false });
  };

  return (
    <div className="rules-permission-container">
      {/* Header: Permission title + Update button */}
      <div className="rules-permission-header">
        <h2>Permission</h2>
        <button className="update-button">Update</button>
      </div>

      {/* First Section */}
      <div className="section">
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

        {/* Permission Checkboxes in 2-column grid */}
        <div className="checkbox-group permission-group">
          {Object.keys(permissions).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={permissions[key as PermissionKeys]}
                onChange={() => handlePermissionChange(key as PermissionKeys)}
              />
              {key.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      {/* Second Section: Facility Access */}
      <div className="section">
        <div className="section-header">
          <h3 className="section-title">Facility Access</h3>
          <div className="facility-buttons">
            <button type="button" onClick={checkAllFacilities}>
              Check All
            </button>
            <button type="button" onClick={uncheckAllFacilities}>
              Uncheck All
            </button>
          </div>
        </div>

        {/* Facility Checkboxes in 5-column grid */}
        <div className="checkbox-group facility-group">
          {Object.keys(facilities).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={facilities[key as PermissionKeys]}
                onChange={() => handleFacilityChange(key as PermissionKeys)}
              />
              {key.toUpperCase()} Facility
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rules_Permission;
