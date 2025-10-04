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
  date: att.Date.split("T")[0],
  inTime: att.In,
  outTime: att.Out,
  duration: att.Duration,
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
  date: abs.Date.split("T")[0],
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
        nid: emp.NID || emp.nid || "",
        personalContact: emp.PersonalContactNumber || emp.personalContact || "",
        officialContact: emp.OfficalContactNumber || emp.officialContact || "",
        email: emp.Email || emp.email || "",
        type: emp.EmployeeType || emp.type || "",
        gender: emp.Gender || emp.gender || "",
        maritalStatus: emp.MaritalStatus || emp.maritalStatus || "",
        bloodGroup: emp.BloodGroup || emp.bloodGroup || "",
        fatherName: emp.FatherName || emp.fatherName || "",
        motherName: emp.MotherName || emp.motherName || "",
        presentAddress: emp.PresentAddress || emp.presentAddress || "",
        permanentAddress: emp.PermanentAddress || emp.permanentAddress || "",
        shift: emp.ShiftSchedule || emp.shift || "",
      });
    });
  }

  console.log("Mapped preview rows:", rows); // debug
  setData(rows);
}, [reportType, dataFetched, reportData]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDownload = () => {
    let csv = columns.join(",") + "\n";

    data.forEach((row) => {
      const rowData = columns.map((col) => {
        switch (col) {
          case "SL": return row.sl;
          case "EmployeeId": return row.id;
          case "EmployeeName": return row.name;
          case "Branch": return row.branch;
          case "Department": return row.dept;
          case "Designation": return row.desg;
          case "Date": return row.date;
          case "DateOfJoin": return row.dateOfJoin;
          case "DateOfResign": return row.dateOfResign;
          case "NID": return row.nid;
          case "PersonalContactNumber": return row.personalContact;
          case "OfficalContactNumber": return row.officialContact;
          case "Email": return row.email;
          case "InTime": return row.inTime;
          case "OutTime": return row.outTime;
          case "Duration": return row.duration;
          case "Remark": return row.remark;
          case "EmployeeType": return row.type;
          case "Gender": return row.gender;
          case "MaritalStatus": return row.maritalStatus;
          case "BloodGroup": return row.bloodGroup;
          case "FatherName": return row.fatherName;
          case "MotherName": return row.motherName;
          case "PresentAddress": return row.presentAddress;
          case "PermanentAddress": return row.permanentAddress;
          case "ShiftSchedule": return row.shift;
          default: return "";
        }
      });
      csv += rowData.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
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
                    <td>{row.sl}</td>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    {reportType === "employee" && (
                      <>
                        <td>{row.branch}</td>
                        <td>{row.dept}</td>
                        <td>{row.desg}</td>
                        <td>{row.dateOfJoin}</td>
                        <td>{row.dateOfResign}</td>
                        <td>{row.nid}</td>
                        <td>{row.personalContact}</td>
                        <td>{row.officialContact}</td>
                        <td>{row.email}</td>
                        <td>{row.type}</td>
                        <td>{row.gender}</td>
                        <td>{row.maritalStatus}</td>
                        <td>{row.bloodGroup}</td>
                        <td>{row.fatherName}</td>
                        <td>{row.motherName}</td>
                        <td>{row.presentAddress}</td>
                        <td>{row.permanentAddress}</td>
                        <td>{row.shift}</td>
                      </>
                    )}
                    {reportType === "attendance" && (
                      <>
                        <td>{row.branch}</td>
                        <td>{row.dept}</td>
                        <td>{row.desg}</td>
                        <td>{row.date}</td>
                        <td>{row.inTime}</td>
                        <td>{row.outTime}</td>
                        <td>{row.duration}</td>
                      </>
                    )}
                    {reportType === "absent" && (
                      <>
                        <td>{row.branch}</td>
                        <td>{row.dept}</td>
                        <td>{row.desg}</td>
                        <td>{row.date}</td>
                        <td>{row.remark}</td>
                      </>
                    )}
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
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={currentPage === idx + 1 ? "active" : ""}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Report_Preview;
