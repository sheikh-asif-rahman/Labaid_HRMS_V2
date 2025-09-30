import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reports_Form.css";
import axios from "axios";
import Popup from "../../Popup/Popup";

type Facility = {
  id: string;
  name: string;
};

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

  // Fetch facilities
  useEffect(() => {
    setPopupOpen(true); // Show loading while fetching

    axios
      .get("http://localhost:3000/api/facilities")
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setFacilities(res.data.data.map((f: any) => ({ id: f.id, name: f.name })));
          setPopupOpen(false); // Hide loading on success
        } else {
          // Invalid response → keep loading forever
          setPopupOpen(true);
        }
      })
      .catch(() => {
        // API failure → keep loading forever
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

  const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacility(e.target.value);
  };

  const handleGetData = async () => {
    setPopupOpen(true); // Show loading while fetching

    const payload: any = {
      facilityId: selectedFacility,
      fromDate: fromDate ? fromDate.toISOString().split("T")[0] : null,
      toDate: toDate ? toDate.toISOString().split("T")[0] : null,
    };
    if (userId.trim()) payload.userId = userId;

    try {
      let res;
      if (reportType === "attendance") {
        res = await axios.post("http://localhost:3000/api/attendancereport", payload);
      } else if (reportType === "absent") {
        res = await axios.post("http://localhost:3000/api/absentreport", payload);
      } else if (reportType === "employee") {
        res = await axios.post("http://localhost:3000/api/employeelist", { facilityId: selectedFacility });
      } else {
        res = { data: [] };
      }

      if (Array.isArray(res.data)) {
        setReportData(res.data);
        setDataFetched(true);
        setPopupOpen(false); // Close loading on success
      } else {
        setReportData([]);
        setPopupOpen(false); // Close loading even if data invalid
      }
    } catch (err) {
      console.error("API Error:", err);
      setReportData([]);
      setPopupOpen(false); // Close loading on API error
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
            onChange={handleFacilityChange}
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

      {/* Infinite Loading Popup */}
      <Popup
        isOpen={popupOpen}
        type="loading"
      />
    </div>
  );
};

export default Reports_Form;
