import React, { useEffect, useState } from "react";
import "./Leave_History.css";

export interface EmployeeData {
  EmployeeId: string;
  EmployeeName: string;
  DepartmentName: string;
  DesignationName: string;
  BranchName: string;
  DateOfJoin: string;
  LeaveEnjoyed: number;
  LeaveBalance: number;
}

export interface LeaveHistoryItem {
  sl?: number;
  EmployeeId: string;
  ApplicationDate: string;
  Purpose: string;
  TotalLeave: number;
  FromDate: string;
  ToDate: string;
  AlternativePerson: string;
  Status: "Approved" | "Rejected" | "Pending";
}

interface LeaveHistoryProps {
  employeeData: EmployeeData | null;
  leaveHistoryData: LeaveHistoryItem[];
}

const Leave_History: React.FC<LeaveHistoryProps> = ({
  employeeData,
  leaveHistoryData,
}) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<LeaveHistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setColumns([
      "SL",
      "Application Date",
      "Purpose",
      "Total Leave",
      "From Date",
      "To Date",
      "Alternative Person",
      "Status",
      "Download",
    ]);

    if (leaveHistoryData && leaveHistoryData.length > 0) {
      const formattedData: LeaveHistoryItem[] = leaveHistoryData
        .map((item) => ({
          ...item,
          ApplicationDate: item.ApplicationDate.split("T")[0],
          FromDate: item.FromDate.split("T")[0],
          ToDate: item.ToDate.split("T")[0],
        }))
        .sort(
          (a, b) =>
            new Date(b.ApplicationDate).getTime() -
            new Date(a.ApplicationDate).getTime()
        )
        .map((item, index) => ({ ...item, sl: index + 1 }));

      setData(formattedData);
    }
  }, [leaveHistoryData]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
    else if (direction === "next" && currentPage < totalPages)
      setCurrentPage(currentPage + 1);
  };

  // ---------------- Download & Print ----------------
  const handleDownload = async (item: LeaveHistoryItem) => {
    if (!employeeData) return;

    const response = await fetch("/leave-template.html");
    let templateHtml = await response.text();

    // Replace placeholders in HTML template
templateHtml = templateHtml
  .replace(/{{empCode}}/g, employeeData.EmployeeId)
  .replace(/{{empName}}/g, employeeData.EmployeeName)
  .replace(/{{designation}}/g, employeeData.DesignationName)
  .replace(/{{department}}/g, employeeData.DepartmentName)
  .replace(
    /{{joiningDate}}/g,
    new Date(employeeData.DateOfJoin).toLocaleDateString()
  )
  // TOTAL LEAVE for Leave Required
  .replace(/{{leaveRequired}}/g, item.TotalLeave.toString())
  .replace(/20 Days/g, `${item.TotalLeave} Days`) // Total Leave in second table
  .replace(/{{leaveEnjoyed}}/g, employeeData.LeaveEnjoyed.toString())
  .replace(/{{leaveBalance}}/g, employeeData.LeaveBalance.toString())
  .replace(/{{fromDate}}/g, item.FromDate)
  .replace(/{{toDate}}/g, item.ToDate)
  .replace(/{{purpose}}/g, item.Purpose)
  .replace(/{{alternativePerson}}/g, item.AlternativePerson);


    // Create hidden iframe to print
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow!.document;
    doc.open();
    doc.write(templateHtml);
    doc.close();

    iframe.contentWindow!.focus();
    iframe.contentWindow!.print();

    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };

  return (
    <div className="report-preview-container">
      <div className="report-preview-header">
        <h2>Leave History</h2>
      </div>

      <div className="table-wrapper-scroll">
        <table className="futuristic-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((item, index) => {
              const isGlobalFirst =
                (currentPage - 1) * rowsPerPage + index === 0;

              const canDownload = isGlobalFirst && item.Status === "Approved";

              return (
                <tr key={item.sl}>
                  <td>{item.sl}</td>
                  <td>{item.ApplicationDate}</td>
                  <td>{item.Purpose}</td>
                  <td>{item.TotalLeave}</td>
                  <td>{item.FromDate}</td>
                  <td>{item.ToDate}</td>
                  <td>{item.AlternativePerson}</td>
                  <td>
                    <span className={`status ${item.Status.toLowerCase()}`}>
                      {item.Status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`download-btn ${!canDownload ? "disabled" : ""}`}
                      onClick={() => canDownload && handleDownload(item)}
                      disabled={!canDownload}
                      title={
                        !canDownload
                          ? isGlobalFirst
                            ? "Only approved records can be downloaded"
                            : "Only the newest record can be downloaded"
                          : ""
                      }
                    >
                      Download
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
            ⬅ Previous
          </button>
          <span className="page-indicator">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default Leave_History;
