import React, { useState } from "react";
import "./Leave_Approval.css";

interface LeaveForm {
  id: number;
  employeeId: string;
  employeeName: string;
  facility: string;
  department: string;
  designation: string;
  purpose: string;
  leaveRequired: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  rejectedBy?: string;
  actionDate?: string;
}

const Leave_Approval: React.FC = () => {
  const [leaveForms] = useState<LeaveForm[]>(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      employeeId: `EMP00${i + 1}`,
      employeeName: `Employee ${i + 1}`,
      facility: "Main Facility",
      department: `Dept ${((i % 3) + 1)}`,
      designation: `Desig ${((i % 4) + 1)}`,
      purpose: `Personal/Medical`,
      leaveRequired: `${(i % 5) + 1} Days`,
      status: i % 3 === 0 ? "Pending" : i % 3 === 1 ? "Approved" : "Rejected",
      approvedBy: i % 3 === 1 ? "Manager A" : undefined,
      rejectedBy: i % 3 === 2 ? "Manager B" : undefined,
      actionDate: i % 3 === 0 ? undefined : "2025-09-19",
    }))
  );

  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const toggleSelectAll = () => {
    setSelectedIds(selectAll ? [] : leaveForms.map(f => f.id));
    setSelectAll(!selectAll);
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds(
      selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]
    );
  };

  const handleApprove = () => alert(`Approved: ${selectedIds.join(", ")}`);
  const handleReject = () => alert(`Rejected: ${selectedIds.join(", ")}`);

  // Filter forms based on status
  const filteredForms = leaveForms.filter(f => f.status === filterStatus);

  return (
    <div className="leave-approval-card">
      {/* Header */}
      <div className="leave-approval-header">
        <h2>{filterStatus} Leaves</h2>
        <div className="leave-approval-actions">
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            placeholder="From Date"
          />
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            placeholder="To Date"
          />
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
              {filterStatus === "Pending" && <th><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>}
              <th>SL</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Facility</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Purpose of Leave</th>
              <th>Leave Required</th>
              {filterStatus === "Approved" && <>
                <th>Approved By</th>
                <th>Date</th>
              </>}
              {filterStatus === "Rejected" && <>
                <th>Rejected By</th>
                <th>Date</th>
              </>}
            </tr>
          </thead>
          <tbody>
            {filteredForms.map((form, index) => (
              <tr key={form.id}>
                {filterStatus === "Pending" && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(form.id)}
                      onChange={() => toggleSelectOne(form.id)}
                    />
                  </td>
                )}
                <td>{index + 1}</td>
                <td>{form.employeeId}</td>
                <td>{form.employeeName}</td>
                <td>{form.facility}</td>
                <td>{form.department}</td>
                <td>{form.designation}</td>
                <td>{form.purpose}</td>
                <td>{form.leaveRequired}</td>
                {filterStatus === "Approved" && <>
                  <td>{form.approvedBy}</td>
                  <td>{form.actionDate}</td>
                </>}
                {filterStatus === "Rejected" && <>
                  <td>{form.rejectedBy}</td>
                  <td>{form.actionDate}</td>
                </>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="leave-approval-pagination">
        <button>{"<"}</button>
        {[...Array(4)].map((_, i) => <button key={i}>{i + 1}</button>)}
        <span>..</span>
        <button>50</button>
        <button>{">"}</button>
      </div>
    </div>
  );
};

export default Leave_Approval;
