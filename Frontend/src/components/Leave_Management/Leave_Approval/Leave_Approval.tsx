import React, { useState, useMemo } from "react";
import "./Leave_Approval.css";

interface LeaveForm {
  id: number;
  employeeId: string;
  employeeName: string;
  facility: string;
  department: string;
  designation: string;
  leaveBalance: number;
  leaveEnjoyed: number;
  leaveRequired: string;
  fromDate: string;
  toDate: string;
  purpose: string;
  alternativePerson: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  rejectedBy?: string;
  actionDate?: string;
}

const Leave_Approval: React.FC = () => {
  // --- Sample data ---
  const [leaveForms] = useState<LeaveForm[]>(
    Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      employeeId: `EMP00${i + 1}`,
      employeeName: `Employee ${i + 1}`,
      facility: "Main Facility",
      department: `Dept ${((i % 3) + 1)}`,
      designation: `Desig ${((i % 4) + 1)}`,
      leaveBalance: 20 - (i % 10),
      leaveEnjoyed: i % 10,
      leaveRequired: `${(i % 5) + 1} Days`,
      fromDate: `2025-10-${(i % 30) + 1}`,
      toDate: `2025-10-${(i % 30) + 2}`,
      purpose: `Personal/Medical\nNeeds rest`,
      alternativePerson: `Employee ${(i % 10) + 1}`,
      status: i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Approved" : "Rejected",
      approvedBy: i % 3 === 1 ? "Manager A" : undefined,
      rejectedBy: i % 3 === 2 ? "Manager B" : undefined,
      actionDate: i % 3 === 0 ? undefined : "2025-09-19",
    }))
  );

  // --- State ---
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

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
              {filterStatus === "Pending" && (
                <th>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={displayedForms.every(f => selectedIds.includes(f.id))}
                  />
                </th>
              )}
              <th>SL</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Facility</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Leave Balance</th>
              <th>Leave Enjoyed</th>
              <th>Leave Required</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Purpose</th>
              <th>Alternative Person</th>
              {filterStatus === "Approved" && <th>Approved By</th>}
              {filterStatus === "Rejected" && <th>Rejected By</th>}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedForms.map((f, i) => {
              const isPending = filterStatus === "Pending";
              const handleRowClick = () => {
                if (isPending) toggleSelectOne(f.id);
              };

              return (
                <tr
                  key={f.id}
                  className={isPending ? "clickable-row" : ""}
                  onClick={handleRowClick}
                >
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
                  <td>{f.leaveBalance}</td>
                  <td>{f.leaveEnjoyed}</td>
                  <td>{f.leaveRequired}</td>
                  <td>{f.fromDate}</td>
                  <td>{f.toDate}</td>
                  <td style={{ whiteSpace: "pre-wrap" }}>{f.purpose}</td>
                  <td>{f.alternativePerson}</td>
                  {filterStatus === "Approved" && <td>{f.approvedBy}</td>}
                  {filterStatus === "Rejected" && <td>{f.rejectedBy}</td>}
                  <td>
                    <span className={`status ${f.status.toLowerCase()}`}>{f.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
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

export default Leave_Approval;
