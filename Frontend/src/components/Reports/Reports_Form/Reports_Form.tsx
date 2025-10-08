import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reports_Form.css";
import axios from "axios";
import Popup from "../../Popup/Popup";
import { API_BASE_URL } from "../../../constants/apiBase";

type Facility = { id: string; name: string };

type Props = {
  reportType: string;
  setReportType: (value: string) => void;
  dataFetched: boolean;
  setDataFetched: (value: boolean) => void;
  setReportData: (value: any[]) => void;
};

const Reports_Form: React.FC<Props> = ({
  reportType,
  setReportType,
  dataFetched,
  setDataFetched,
  setReportData,
}) => {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<"loading" | "notdone">("loading");
  const [popupMessage, setPopupMessage] = useState("");

  // Permissions state
  const [specialPermissions, setSpecialPermissions] = useState<string[]>([]);

  // Fetch special permissions from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    let permissions: string[] = [];

    try {
      if (user.Permission) {
        const permObj = JSON.parse(user.Permission);
        permissions = permObj.Special_Permission || [];
      }
    } catch (e) {
      console.error("Failed to parse permissions", e);
    }

    setSpecialPermissions(permissions);
  }, []);

  // Fetch facilities
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const employeeId = user?.EmployeeId;

    if (!employeeId) {
      setPopupType("notdone");
      setPopupMessage("No logged-in user found.");
      setPopupOpen(true);
      return;
    }

    setPopupOpen(true);
    setPopupType("loading");

    axios
      .post(`${API_BASE_URL}accessfacility`, { employeeId })
      .then((res) => {
        if (Array.isArray(res.data.Devices)) {
          setFacilities(
            res.data.Devices.map((f: any) => ({ id: f.id, name: f.name }))
          );
          setPopupOpen(false);
        } else {
          setPopupType("notdone");
          setPopupMessage("Failed to load facilities");
          setPopupOpen(true);
        }
      })
      .catch((err) => {
        console.error("Facility Load Error:", err);
        setPopupType("notdone");
        setPopupMessage("Server unavailable. Cannot load facilities.");
        setPopupOpen(true);
      });
  }, []);

  // Permission checks for dropdown options
  const canAccessAttendance = specialPermissions.includes(
    "Can Access Attendance Report"
  );
  const canAccessAbsent = specialPermissions.includes(
    "Can Access Absent Report"
  );
  const canAccessEmployeeList = specialPermissions.includes(
    "Can Access Employee List"
  );

  const handleReportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    setDataFetched(false);
    setFromDate(null);
    setToDate(null);
    setSelectedFacility("");
    setUserId("");
    setReportData([]);
  };

  // Local date formatter (no UTC shift)
  const formatLocalDate = (date: Date | null): string | null => {
    if (!date) return null;
    return date.toLocaleDateString("en-CA"); // yyyy-MM-dd, local timezone
  };

  const handleGetData = async () => {
    if (fromDate && toDate && fromDate > toDate) {
      setPopupType("notdone");
      setPopupMessage(
        "Invalid date range: 'From Date' cannot be after 'To Date'."
      );
      setPopupOpen(true);
      return;
    }

    setPopupOpen(true);
    setPopupType("loading");

    const payload: any = {
      facilityId: selectedFacility,
      fromDate: formatLocalDate(fromDate),
      toDate: formatLocalDate(toDate),
    };
    if (userId.trim()) payload.userId = userId;

    try {
      let res;
      if (reportType === "attendance") {
        res = await axios.post(`${API_BASE_URL}attendancereport`, payload);
      } else if (reportType === "absent") {
        res = await axios.post(`${API_BASE_URL}absentreport`, payload);
      } else if (reportType === "employee") {
        res = await axios.post(`${API_BASE_URL}employeelist`, {
          facilityId: selectedFacility,
        });
      } else {
        res = { data: [] };
      }

      if (Array.isArray(res.data)) {
        const mappedData = res.data.map((emp: any) => ({
          ...emp,
          Branch: emp.Branch || emp.branch || "",
          Department: emp.Department || emp.department || "",
          Designation: emp.Designation || emp.designation || "",
        }));

        setReportData(mappedData);
        setDataFetched(true);
        setPopupOpen(false);
      } else {
        setPopupType("notdone");
        setPopupMessage("Invalid response from server.");
        setPopupOpen(true);
      }
    } catch (err: any) {
      setPopupType("notdone");
      setPopupMessage(
        err?.response?.data?.message ||
          "Server unreachable. Please try again later."
      );
      setPopupOpen(true);
    }
  };

  const isGeneralReport =
    reportType === "attendance" || reportType === "absent";

  return (
    <div className="reports-form-container">
      {/* Header */}
      <div className="reports-form-header">
        <h3 className="reports-form-title">Reports</h3>
        <select
          className="reports-form-dropdown"
          value={reportType}
          onChange={handleReportChange}
        >
          <option value="">Select Report Type</option>
          {canAccessAttendance && (
            <option value="attendance">Attendance Report</option>
          )}
          {canAccessAbsent && <option value="absent">Absent Report</option>}
          {canAccessEmployeeList && (
            <option value="employee">Employee List</option>
          )}
        </select>
      </div>

      {/* Options Section */}
      <div className="reports-form-options">
        <div className="reports-form-group">
          <label>Select Facility</label>
          <select
            disabled={!reportType || facilities.length === 0}
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            <option value="">Select Facility</option>
            {facilities.map((facility) =>
              facility.name ? (
                <option key={facility.id} value={facility.id}>
                  {facility.name}
                </option>
              ) : null
            )}
          </select>
        </div>

        <div className="reports-form-group">
          <label>User ID (Optional)</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            disabled={!isGeneralReport}
          />
        </div>

        <div className="reports-form-group">
          <label>From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date: Date | null) => setFromDate(date)}
            disabled={!isGeneralReport}
            placeholderText="Select From Date"
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="reports-form-group">
          <label>To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date: Date | null) => setToDate(date)}
            disabled={!isGeneralReport}
            placeholderText="Select To Date"
            dateFormat="yyyy-MM-dd"
            minDate={fromDate || undefined}
          />
        </div>
      </div>

      {/* Get Data Button */}
      <div className="reports-form-buttons">
        {!dataFetched ? (
          <button
            className="reports-form-btn reports-form-btn-blue"
            onClick={handleGetData}
            disabled={
              !reportType || !selectedFacility || facilities.length === 0
            }
          >
            Get Data
          </button>
        ) : (
          <button
            className="reports-form-btn reports-form-btn-secondary"
            onClick={() => {
              setReportType("");
              setDataFetched(false);
              setFromDate(null);
              setToDate(null);
              setSelectedFacility("");
              setUserId("");
              setReportData([]);
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* Popup */}
      <Popup
        isOpen={popupOpen}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupOpen(false)}
      />
    </div>
  );
};

export default Reports_Form;
