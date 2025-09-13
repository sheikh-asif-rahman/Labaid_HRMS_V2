import React, { useState } from "react";
import Report_Type_Selector from "../components/Reports/Report_Type_Selector/Report_Type_Selector";
import Report_Slider from "../components/Reports/Report_Slider/Report_Slider";
import ReportPreview from "../components/Reports/Report_Preview/Report_Preview";

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState("attendance");
  const [reportData, setReportData] = useState<any[]>([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const handleGetReport = (formData: any) => {
    // define columns
    let columns: string[] = [];
    if (["attendance", "leave", "absent"].includes(selectedReport)) {
      columns = [
        "Employee ID",
        "Name",
        "Department",
        "Designation",
        "Facility",
        "From Date",
        "To Date",
        "Status",
        "Remarks",
      ];
    } else if (selectedReport === "employee-list") {
      columns = Array.from({ length: 15 }, (_, i) => `Col ${i + 1}`);
    }

    const dummyData = Array.from({ length: 10 }).map((_, rowIdx) => {
      const row: any = {};
      columns.forEach((col, cIdx) => {
        row[col] = `${selectedReport}-${rowIdx + 1}-${cIdx + 1}`;
      });
      return row;
    });

    setReportData(dummyData);
    setIsReportGenerated(true);
  };

  const handleResetReport = () => {
    setReportData([]);
    setIsReportGenerated(false);
  };

  const previewColumns =
    ["attendance", "leave", "absent"].includes(selectedReport)
      ? [
          "Employee ID",
          "Name",
          "Department",
          "Designation",
          "Facility",
          "From Date",
          "To Date",
          "Status",
          "Remarks",
        ]
      : Array.from({ length: 15 }, (_, i) => `Col ${i + 1}`);

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "20px",
        height: "calc(100vh - 40px)",
        boxSizing: "border-box",
      }}
    >
      {/* Left Column */}
      <div
        style={{
          flex: "0 0 200px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Report_Type_Selector
          selectedReport={selectedReport}
          onChange={setSelectedReport}
        />
        <Report_Slider
          reportType={selectedReport}
          onGetReport={
            isReportGenerated ? handleResetReport : handleGetReport
          }
          isReportGenerated={isReportGenerated}
        />
      </div>

      {/* Right Column */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ReportPreview
          data={reportData}
          columns={previewColumns}
          isVisible={isReportGenerated}
        />
      </div>
    </div>
  );
};

export default Reports;
