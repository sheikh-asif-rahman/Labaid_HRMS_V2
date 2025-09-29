import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Reports_Form.css";
import axios from "axios";

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

  // Fetch facilities
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/facilities")
      .then((res) => {
        if (res.data.success && Array.isArray(res.data.data)) {
          setFacilities(res.data.data.map((f: any) => ({ id: f.id, name: f.name })));
        } else {
          setFacilities([]);
        }
      })
      .catch(() => setFacilities([]));
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
      } else {
        res = { data: [] };
      }

      if (Array.isArray(res.data)) {
        setReportData(res.data);
        setDataFetched(true);
      } else {
        setReportData([]);
      }
    } catch (err) {
      setReportData([]);
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
            disabled={!reportType}
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
            disabled={!reportType || !selectedFacility}
          >
            Get Data
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Reports_Form;
