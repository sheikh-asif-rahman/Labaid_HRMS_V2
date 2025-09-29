import React, { useEffect, useState } from "react";
import "./Report_Preview.css";

type Props = {
  reportType: string;
  dataFetched: boolean;
  reportData: any[]; // passed from parent
};

const Report_Preview: React.FC<Props> = ({ reportType, dataFetched, reportData }) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  useEffect(() => {
    if (!dataFetched) {
      setColumns([]);
      setData([]);
      setCurrentPage(1);
      return;
    }

    if (reportType === "attendance") {
      setColumns([
        "SL",
        "EmployeeId",
        "EmployeeName",
        "BranchName",
        "DepartmentName",
        "DesignationName",
        "Date",
        "InTime",
        "OutTime",
        "Duration",
      ]);

      // Flatten API response
      const rows: any[] = [];
      reportData.forEach((emp, idx) => {
        emp.Attendance.forEach((att: any, attIdx: number) => {
          rows.push({
            sl: rows.length + 1,
            id: emp.EmployeeId,
            name: emp.EmployeeName,
            branch: emp.BranchName,
            dept: emp.DepartmentName,
            desg: emp.DesignationName,
            date: att.Date.split("T")[0],
            inTime: att.In,
            outTime: att.Out,
            duration: att.Duration,
          });
        });
      });
      setData(rows);
    }
    else if (reportType === "absent") {
    setColumns([
      "SL",
      "EmployeeId",
      "EmployeeName",
      "BranchName",
      "DepartmentName",
      "DesignationName",
      "Date",
      "Remark",
    ]);
    const rows: any[] = [];
    reportData.forEach((emp) => {
      emp.AbsentDays.forEach((abs: any) => {
        rows.push({
          sl: rows.length + 1,
          id: emp.EmployeeId,
          name: emp.EmployeeName,
          branch: emp.BranchName,
          dept: emp.DepartmentName,
          desg: emp.DesignationName,
          date: abs.Date.split("T")[0],
          remark: "Absent",
        });
      });
    });
    setData(rows);
  }
  }, [reportType, dataFetched, reportData]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="report-preview-container">
      <div className="report-preview-header">
        <h2>Report Preview</h2>
      </div>

      {!dataFetched ? (
        <div className="no-data-message">
          No data to show. Please select a report type and click <strong>Get Data</strong>.
        </div>
      ) : (
        <>
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
  {displayedData.map((row, rowIndex) => (
    <tr key={rowIndex}>
      <td>{row.sl}</td>
      <td>{row.id}</td>
      <td>{row.name}</td>
      <td>{row.branch}</td>
      <td>{row.dept}</td>
      <td>{row.desg}</td>
      <td>{row.date}</td>

      {reportType === "attendance" ? (
        <>
          <td>{row.inTime}</td>
          <td>{row.outTime}</td>
          <td>{row.duration}</td>
        </>
      ) : reportType === "absent" ? (
        <td>{row.remark}</td>
      ) : null}
    </tr>
  ))}
</tbody>

            </table>
          </div>

          <button className="report-preview-download-btn">Download</button>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Report_Preview;
