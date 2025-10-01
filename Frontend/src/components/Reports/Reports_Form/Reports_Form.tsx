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
      console.log("Facilities API Response:", res.data);

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



  const handleReportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value);
    setDataFetched(false);
    setFromDate(null);
    setToDate(null);
    setSelectedFacility("");
    setUserId("");
    setReportData([]);
  };

const handleGetData = async () => {
  // Validate date range first
  if (fromDate && toDate && fromDate > toDate) {
    setPopupType("notdone");
    setPopupMessage("Invalid date range: 'From Date' cannot be after 'To Date'.");
    setPopupOpen(true);
    return; // Stop API call
  }

  // Show loading
  setPopupOpen(true);
  setPopupType("loading");

  const payload: any = {
    facilityId: selectedFacility,
    fromDate: fromDate ? fromDate.toISOString().split("T")[0] : null,
    toDate: toDate ? toDate.toISOString().split("T")[0] : null,
  };
  if (userId.trim()) payload.userId = userId;

  try {
    let res;
    if (reportType === "attendance") {
      res = await axios.post(`${API_BASE_URL}attendancereport`, payload);
    } else if (reportType === "absent") {
      res = await axios.post(`${API_BASE_URL}absentreport`, payload);
    } else if (reportType === "employee") {
      res = await axios.post(`${API_BASE_URL}employeelist`, { facilityId: selectedFacility });
    } else {
      res = { data: [] };
    }

    if (Array.isArray(res.data)) {
      setReportData(res.data);
      setDataFetched(true);
      setPopupOpen(false); // Close on success
    } else {
      setPopupType("notdone");
      setPopupMessage("Invalid response from server.");
      setPopupOpen(true);
    }
  } catch (err: any) {
    setPopupType("notdone");
    setPopupMessage(
      err?.response?.data?.message || "Server unreachable. Please try again later."
    );
    setPopupOpen(true);
  }
};


  const isGeneralReport = reportType === "attendance" || reportType === "absent";

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
          <option value="attendance">Attendance Report</option>
          <option value="absent">Absent Report</option>
          <option value="employee">Employee List</option>
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
            disabled={!reportType || !selectedFacility || facilities.length === 0}
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
