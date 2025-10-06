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

    const rows: any[] = [];

    if (reportType === "attendance") {
      setColumns([
        "SL",
        "EmployeeId",
        "EmployeeName",
        "Branch",
        "Department",
        "Designation",
        "Date",
        "InTime",
        "OutTime",
        "Duration",
      ]);

      reportData.forEach((emp) => {
        emp.Attendance.forEach((att: any) => {
          rows.push({
            sl: rows.length + 1,
            id: emp.EmployeeId,
            name: emp.EmployeeName,
            branch: emp.BranchName || emp.Branch || emp.branch || "",
            dept: emp.DepartmentName || emp.Department || emp.department || "",
            desg: emp.DesignationName || emp.Designation || emp.designation || "",
            date: att.Date?.split("T")[0] || "",
            inTime: att.In || "",
            outTime: att.Out || "",
            duration: att.Duration || "",
          });
        });
      });
    } else if (reportType === "absent") {
      setColumns([
        "SL",
        "EmployeeId",
        "EmployeeName",
        "Branch",
        "Department",
        "Designation",
        "Date",
        "Remark",
      ]);

      reportData.forEach((emp) => {
        emp.AbsentDays.forEach((abs: any) => {
          rows.push({
            sl: rows.length + 1,
            id: emp.EmployeeId,
            name: emp.EmployeeName,
            branch: emp.BranchName || emp.Branch || emp.branch || "",
            dept: emp.DepartmentName || emp.Department || emp.department || "",
            desg: emp.DesignationName || emp.Designation || emp.designation || "",
            date: abs.Date?.split("T")[0] || "",
            remark: "Absent",
          });
        });
      });
    } else if (reportType === "employee") {
      setColumns([
        "SL",
        "EmployeeId",
        "EmployeeName",
        "Branch",
        "Department",
        "Designation",
        "DateOfJoin",
        "DateOfResign",
        "NID",
        "PersonalContactNumber",
        "OfficalContactNumber",
        "Email",
        "EmployeeType",
        "Gender",
        "MaritalStatus",
        "BloodGroup",
        "FatherName",
        "MotherName",
        "PresentAddress",
        "PermanentAddress",
        "ShiftSchedule",
      ]);

      reportData.forEach((emp, index) => {
        rows.push({
          sl: index + 1,
          id: emp.EmployeeId,
          name: emp.EmployeeName,
          branch: emp.Branch || emp.branch || "",
          dept: emp.Department || emp.department || "",
          desg: emp.Designation || emp.designation || "",
          dateOfJoin: emp.DateOfJoin ? emp.DateOfJoin.split("T")[0] : "",
          dateOfResign: emp.DateOfResign ? emp.DateOfResign.split("T")[0] : "",
          nid: emp.NID || "",
          personalContact: emp.PersonalContactNumber || "",
          officialContact: emp.OfficalContactNumber || "",
          email: emp.Email || "",
          type: emp.EmployeeType || "",
          gender: emp.Gender || "",
          maritalStatus: emp.MaritalStatus || "",
          bloodGroup: emp.BloodGroup || "",
          fatherName: emp.FatherName || "",
          motherName: emp.MotherName || "",
          presentAddress: emp.PresentAddress || "",
          permanentAddress: emp.PermanentAddress || "",
          shift: emp.ShiftSchedule || "",
        });
      });
    }

    console.log("✅ Mapped preview rows:", rows);
    setData(rows);
  }, [reportType, dataFetched, reportData]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDownload = () => {
    let csv = columns.join(",") + "\n";

    data.forEach((row) => {
      const rowData = columns.map((col) => {
        let value = "";

        switch (col) {
          case "SL": value = row.sl; break;
          case "EmployeeId": value = row.id; break;
          case "EmployeeName": value = row.name; break;
          case "Branch": value = row.branch; break;
          case "Department": value = row.dept; break;
          case "Designation": value = row.desg; break;
          case "Date": value = row.date; break;
          case "InTime": value = row.inTime; break;
          case "OutTime": value = row.outTime; break;
          case "Duration": value = row.duration; break;
          case "Remark": value = row.remark; break;
          case "DateOfJoin": value = row.dateOfJoin; break;
          case "DateOfResign": value = row.dateOfResign; break;
          case "NID": value = row.nid; break;
          case "PersonalContactNumber": value = row.personalContact; break;
          case "OfficalContactNumber": value = row.officialContact; break;
          case "Email": value = row.email; break;
          case "EmployeeType": value = row.type; break;
          case "Gender": value = row.gender; break;
          case "MaritalStatus": value = row.maritalStatus; break;
          case "BloodGroup": value = row.bloodGroup; break;
          case "FatherName": value = row.fatherName; break;
          case "MotherName": value = row.motherName; break;
          case "PresentAddress": value = row.presentAddress; break;
          case "PermanentAddress": value = row.permanentAddress; break;
          case "ShiftSchedule": value = row.shift; break;
          default: value = ""; break;
        }

        if (value === null || value === undefined) value = "";
        return `"${String(value).replace(/"/g, '""')}"`;
      });

      csv += rowData.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
                    {columns.map((col) => {
                      const key = col;
                      const val = row[
                        {
                          SL: "sl",
                          EmployeeId: "id",
                          EmployeeName: "name",
                          Branch: "branch",
                          Department: "dept",
                          Designation: "desg",
                          Date: "date",
                          InTime: "inTime",
                          OutTime: "outTime",
                          Duration: "duration",
                          Remark: "remark",
                          DateOfJoin: "dateOfJoin",
                          DateOfResign: "dateOfResign",
                          NID: "nid",
                          PersonalContactNumber: "personalContact",
                          OfficalContactNumber: "officialContact",
                          Email: "email",
                          EmployeeType: "type",
                          Gender: "gender",
                          MaritalStatus: "maritalStatus",
                          BloodGroup: "bloodGroup",
                          FatherName: "fatherName",
                          MotherName: "motherName",
                          PresentAddress: "presentAddress",
                          PermanentAddress: "permanentAddress",
                          ShiftSchedule: "shift",
                        }[col] as keyof typeof row
                      ];
                      return <td key={key}>{val}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="report-preview-download-btn" onClick={handleDownload}>
            Download
          </button>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
                ⬅ Previous
              </button>

              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>

              <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
                Next ➡
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Report_Preview;
