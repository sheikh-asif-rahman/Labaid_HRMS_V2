import React, { useState } from "react";
import "./Leave_Approval.css";

interface LeaveForm {
  id: number;
  employeeId: string;
  employeeName: string;
  facility: string; // plain text
  department: string;
  designation: string;
  purpose: string;
  leaveRequired: string;
}

const Leave_Approval: React.FC = () => {
  const [leaveForms, setLeaveForms] = useState<LeaveForm[]>(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      employeeId: `EMP00${i + 1}`,
      employeeName: `Employee ${i + 1}`,
      facility: "Main Facility", // plain text
      department: `Dept ${((i % 3) + 1)}`,
      designation: `Desig ${((i % 4) + 1)}`,
      purpose: `Personal/Medical`,
      leaveRequired: `${(i % 5) + 1} Days`,
    }))
  );

  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectAll = () => {
    setSelectedIds(selectAll ? [] : leaveForms.map(f => f.id));
    setSelectAll(!selectAll);
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
  };

  const handleApprove = () => alert(`Approved: ${selectedIds.join(", ")}`);
  const handleReject = () => alert(`Rejected: ${selectedIds.join(", ")}`);

  return (
    <div className="leave-approval-card">
      {/* Header */}
      <div className="leave-approval-header">
        <h2>Pending Leave Forms</h2>
        <div className="leave-approval-actions">
          <select>
            <option value="">Filter</option>
            <option value="Dept1">Department 1</option>
            <option value="Dept2">Department 2</option>
          </select>
          <button className="approve-btn" onClick={handleApprove}>Approve</button>
          <button className="reject-btn" onClick={handleReject}>Reject</button>
        </div>
      </div>

      {/* Table */}
      <div className="leave-approval-table-wrapper">
        <table className="leave-approval-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
              <th>SL</th>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Facility</th> {/* now plain text */}
              <th>Department</th>
              <th>Designation</th>
              <th>Purpose of Leave</th>
              <th>Leave Required</th>
            </tr>
          </thead>
          <tbody>
            {leaveForms.map((form, index) => (
              <tr key={form.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(form.id)}
                    onChange={() => toggleSelectOne(form.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{form.employeeId}</td>
                <td>{form.employeeName}</td>
                <td>{form.facility}</td> {/* plain text */}
                <td>{form.department}</td>
                <td>{form.designation}</td>
                <td>{form.purpose}</td>
                <td>{form.leaveRequired}</td>
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
