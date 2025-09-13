import React, { useState } from "react";
import "./Employee_Approval.css";

interface Employee {
  id: number;
  userId: string;
  userName: string;
  department: string;
  designation: string;
  branch: string;
  dateOfJoining: string;
  createdBy: string;
  remark: string;
}

const Employee_Approval: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(
    Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      userId: `U00${i + 1}`,
      userName: `Employee ${i + 1}`,
      department: `Dept ${((i % 3) + 1)}`,
      designation: `Desig ${((i % 4) + 1)}`,
      branch: `Branch ${((i % 2) + 1)}`,
      dateOfJoining: `2023-0${((i % 9) + 1)}-0${((i % 28) + 1)}`,
      createdBy: `Admin`,
      remark: "",
    }))
  );

  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelectAll = () => {
    setSelectedIds(selectAll ? [] : employees.map(emp => emp.id));
    setSelectAll(!selectAll);
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter(i => i !== id) : [...selectedIds, id]);
  };

  const handleRemarkChange = (id: number, value: string) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, remark: value } : emp));
  };

  const handleApprove = () => alert(`Approved: ${selectedIds.join(", ")}`);
  const handleReject = () => alert(`Rejected: ${selectedIds.join(", ")}`);

  return (
    <div className="employee-card">
      {/* Header */}
      <div className="header">
        <h2>Employee Pending</h2>
        <div className="actions">
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
      <div className="table-wrapper">
        <table className="futuristic-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /></th>
              <th>SL</th>
              <th>User ID</th>
              <th>User Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Branch</th>
              <th>Date of Joining</th>
              <th>Created By</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => toggleSelectOne(emp.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{emp.userId}</td>
                <td>{emp.userName}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>{emp.branch}</td>
                <td>{emp.dateOfJoining}</td>
                <td>{emp.createdBy}</td>
                <td>
                  <input
                    type="text"
                    value={emp.remark}
                    onChange={(e) => handleRemarkChange(emp.id, e.target.value)}
                    placeholder="Remark"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button>{"<"}</button>
        {[...Array(4)].map((_, i) => <button key={i}>{i + 1}</button>)}
        <span>..</span>
        <button>50</button>
        <button>{">"}</button>
      </div>
    </div>
  );
};

export default Employee_Approval;
