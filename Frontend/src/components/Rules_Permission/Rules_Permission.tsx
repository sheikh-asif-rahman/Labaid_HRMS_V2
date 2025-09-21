import React, { useEffect, useState } from "react";
import "./Rules_Permission.css";
import axios from "axios";
import Popup from "../Popup/Popup";
import { API_BASE_URL } from "../../constants/apiBase";

type PermissionMap = Record<string, boolean>;

interface Rules_PermissionProps {
  employeeData?: any;
}

const Rules_Permission: React.FC<Rules_PermissionProps> = ({ employeeData }) => {
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

  const [access, setAccess] = useState<PermissionMap>(
    Object.fromEntries(accessList.map((item) => [item, false]))
  );
  const [special, setSpecial] = useState<PermissionMap>(
    Object.fromEntries(specialPermissions.map((item) => [item, false]))
  );
  const [facilities, setFacilities] = useState<PermissionMap>(
    Object.fromEntries(facilityAccess.map((item) => [item, false]))
  );

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  // Fill checkboxes from employeeData
  useEffect(() => {
    if (employeeData) {
      setUserId(employeeData.EmployeeId);
      setUserName(employeeData.EmployeeName);

      // Parse Permission JSON if it is a string
      let permObj: any = {};
      if (employeeData.Permission) {
        try {
          permObj =
            typeof employeeData.Permission === "string"
              ? JSON.parse(employeeData.Permission)
              : employeeData.Permission;
        } catch (e) {
          console.error("Failed to parse Permission:", e);
          permObj = {};
        }
      }

      setAccess(
        Object.fromEntries(accessList.map((i) => [i, permObj.Access?.includes(i) || false]))
      );
      setSpecial(
        Object.fromEntries(
          specialPermissions.map((i) => [i, permObj.Special_Permission?.includes(i) || false])
        )
      );
      setFacilities(
        Object.fromEntries(
          facilityAccess.map((i) => [i, permObj.Facility_Access?.includes(i) || false])
        )
      );
    } else {
      // Clear all
      setUserId("");
      setUserName("");
      setAccess(Object.fromEntries(accessList.map((item) => [item, false])));
      setSpecial(Object.fromEntries(specialPermissions.map((item) => [item, false])));
      setFacilities(Object.fromEntries(facilityAccess.map((item) => [item, false])));
    }
  }, [employeeData]);

  const toggleAccess = (key: string) => setAccess((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleSpecial = (key: string) => setSpecial((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleFacility = (key: string) => setFacilities((prev) => ({ ...prev, [key]: !prev[key] }));

  const checkAll = (list: string[], setter: React.Dispatch<React.SetStateAction<PermissionMap>>) =>
    setter(Object.fromEntries(list.map((i) => [i, true])));
  const uncheckAll = (list: string[], setter: React.Dispatch<React.SetStateAction<PermissionMap>>) =>
    setter(Object.fromEntries(list.map((i) => [i, false])));

  const handleUpdate = async () => {
    if (!userId) return;

    const payload = {
      EmployeeId: userId,
      EmployeeName: userName,
      Permission: {
        Access: accessList.filter((item) => access[item]),
        Special_Permission: specialPermissions.filter((item) => special[item]),
        Facility_Access: facilityAccess.filter((item) => facilities[item]),
      },
      AccessToBranchId: employeeData?.AccessToBranchId || "",
    };

    try {
      setPopupType("loading");
      setPopupMessage("Updating...");

      await axios.post(`${API_BASE_URL}updateEmployeeAccessData`, payload);

      setPopupType("done");
      setPopupMessage("Update successful!");
    } catch (error) {
      console.error("Update failed:", error);
      setPopupType("notdone");
      setPopupMessage("Update failed!");
    }
  };

  return (
    <div className="rules-permission-container">
      {/* Header */}
      <div className="rules-permission-header">
        <h2>Permission</h2>
        {userId && <button className="update-button" onClick={handleUpdate}>Update</button>}
      </div>

      {/* User Info */}
      <div className="row">
        <div className="field">
          <label>User ID:</label>
          <input type="text" value={userId} readOnly />
        </div>
        <div className="field">
          <label>User Name:</label>
          <input type="text" value={userName} readOnly />
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
              <input type="checkbox" checked={access[item]} onChange={() => toggleAccess(item)} />
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
              <input type="checkbox" checked={special[item]} onChange={() => toggleSpecial(item)} />
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
              <input type="checkbox" checked={facilities[item]} onChange={() => toggleFacility(item)} />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* Popup for update */}
      {popupType && (
        <Popup
          isOpen={true}
          type={popupType}
          message={popupMessage}
          onClose={() => setPopupType(null)}
        />
      )}
    </div>
  );
};

export default Rules_Permission;
