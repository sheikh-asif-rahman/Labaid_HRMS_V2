import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "./Leave_Approval.css";

interface LeaveForm {
  id: number;
  employeeId: string;
  employeeName: string;
  facility: string;
  department: string;
  designation: string;
  leaveRequired?: string;
  fromDate: string;
  toDate: string;
  purpose: string;
  alternativePerson: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
}

const Leave_Approval: React.FC = () => {
  const [leaveForms, setLeaveForms] = useState<LeaveForm[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // --- Fetch data from API ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("user");
        const employeeId = user ? JSON.parse(user).EmployeeId : "";

        if (!employeeId) return;

        const res = await axios.post("http://localhost:3000/api/leave-approve-reject", { EmployeeId: employeeId });

        if (res.data.success) {
          const mappedData: LeaveForm[] = res.data.data.map((item: any, idx: number) => {
            const normalizedStatus =
              item.Status?.toLowerCase() === "approved"
                ? "Approved"
                : item.Status?.toLowerCase() === "rejected"
                ? "Rejected"
                : "Pending";

            return {
              id: idx + 1,
              employeeId: item.EmployeeId,
              employeeName: item.EmployeeName,
              facility: item.BranchName,
              department: item.DepartmentName,
              designation: item.DesignationName,
              fromDate: item.FromDate.split("T")[0],
              toDate: item.ToDate.split("T")[0],
              purpose: item.Purpose,
              alternativePerson: item.AlternativePerson,
              status: normalizedStatus,
              approvedBy: normalizedStatus === "Approved" ? item["Approved/Rejected By"] : undefined,
              approvedDate: normalizedStatus === "Approved" ? item["Approved/Rejected Date"]?.split("T")[0] : undefined,
              rejectedBy: normalizedStatus === "Rejected" ? item["Approved/Rejected By"] : undefined,
              rejectedDate: normalizedStatus === "Rejected" ? item["Approved/Rejected Date"]?.split("T")[0] : undefined,
              leaveRequired: `${item.TotalLeave} Day${item.TotalLeave > 1 ? "s" : ""}`,
            };
          });

          setLeaveForms(mappedData);
        }
      } catch (err) {
        console.error("Error fetching leave data", err);
      }
    };

    fetchData();
  }, []);

  // --- Computed values ---
  const filteredForms = useMemo(
    () => leaveForms.filter(f => f.status === filterStatus),
    [leaveForms, filterStatus]
  );

  const totalPages = Math.ceil(filteredForms.length / rowsPerPage);
  const displayedForms = useMemo(
    () =>
      filteredForms.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      ),
    [filteredForms, currentPage]
  );

  // --- Handlers ---
  const toggleSelectOne = (id: number) => {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id]);
  };

  const toggleSelectAll = () => {
    const pageIds = displayedForms.map(f => f.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) setSelectedIds(selectedIds.filter(id => !pageIds.includes(id)));
    else setSelectedIds([...selectedIds, ...pageIds.filter(id => !selectedIds.includes(id))]);
  };

  const handleApprove = () => alert(`Approved: ${selectedIds.join(", ")}`);
  const handleReject = () => alert(`Rejected: ${selectedIds.join(", ")}`);

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
    if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="leave-approval-card">
      {/* Header */}
      <div className="leave-approval-header">
        <h2>{filterStatus} Leaves</h2>
        <div className="leave-approval-actions">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          {filterStatus === "Pending" && (
            <>
              <button className="approve-btn" onClick={handleApprove}>Approve</button>
              <button className="reject-btn" onClick={handleReject}>Reject</button>
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="leave-approval-table-wrapper">
        <table className="leave-approval-table">
          <thead>
            <tr>
              {filterStatus === "Pending" && <th><input type="checkbox" onChange={toggleSelectAll} checked={displayedForms.every(f => selectedIds.includes(f.id))} /></th>}
              <th>SL</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Facility</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Leave Required</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Purpose</th>
              <th>Alternative Person</th>
              {filterStatus === "Approved" && <>
                <th>Approved By</th>
                <th>Approved Date</th>
              </>}
              {filterStatus === "Rejected" && <>
                <th>Rejected By</th>
                <th>Rejected Date</th>
              </>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedForms.length > 0 ? (
              displayedForms.map((f, i) => {
                const isPending = filterStatus === "Pending";
                const handleRowClick = () => { if (isPending) toggleSelectOne(f.id); };
                return (
                  <tr key={f.id} className={isPending ? "clickable-row" : ""} onClick={handleRowClick}>
                    {isPending && (
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(f.id)}
                          onChange={() => toggleSelectOne(f.id)}
                          onClick={e => e.stopPropagation()}
                        />
                      </td>
                    )}
                    <td>{(currentPage - 1) * rowsPerPage + i + 1}</td>
                    <td>{f.employeeId}</td>
                    <td>{f.employeeName}</td>
                    <td>{f.facility}</td>
                    <td>{f.department}</td>
                    <td>{f.designation}</td>
                    <td>{f.leaveRequired}</td>
                    <td>{f.fromDate}</td>
                    <td>{f.toDate}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{f.purpose}</td>
                    <td>{f.alternativePerson}</td>
                    {filterStatus === "Approved" && <>
                      <td>{f.approvedBy}</td>
                      <td>{f.approvedDate}</td>
                    </>}
                    {filterStatus === "Rejected" && <>
                      <td>{f.rejectedBy}</td>
                      <td>{f.rejectedDate}</td>
                    </>}
                    <td><span className={`status ${f.status.toLowerCase()}`}>{f.status}</span></td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={filterStatus === "Pending" ? 16 : 17} style={{ textAlign: "center", padding: "20px", fontStyle: "italic", color: "#555" }}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>⬅ Previous</button>
          <span className="page-indicator">Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>Next ➡</button>
        </div>
      )}
    </div>
  );
};

export default Leave_Approval;
