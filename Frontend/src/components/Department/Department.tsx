import React, { useState } from "react";
import "./Department.css";

interface DepartmentData {
  id: number;
  name: string;
  status: string;
}

const Department: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([
    { id: 1, name: "HR", status: "Active" },
    { id: 2, name: "Finance", status: "Inactive" },
    { id: 3, name: "IT", status: "Active" },
  ]);

  const [formData, setFormData] = useState({ name: "", status: "Active" });
  const [editId, setEditId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editId === null) {
      const newDepartment = {
        id: departments.length + 1,
        name: formData.name,
        status: formData.status,
      };
      setDepartments([...departments, newDepartment]);
    } else {
      setDepartments(
        departments.map((dep) =>
          dep.id === editId ? { ...dep, name: formData.name, status: formData.status } : dep
        )
      );
    }
    setFormData({ name: "", status: "Active" });
    setEditId(null);
  };

  const handleEdit = (dep: DepartmentData) => {
    setFormData({ name: dep.name, status: dep.status });
    setEditId(dep.id);
  };

  return (
    <div className="department-main-container">
      {/* Header */}
      <div className="department-header">
        <h2>Department Setup</h2>
        <button
          className={formData.name ? "active-btn" : "disabled-btn"}
          onClick={handleSave}
          disabled={!formData.name}
        >
          {editId !== null ? "Update" : "Save"}
        </button>
      </div>

      {/* Form */}
      <div className="department-form-card">
        <div className="form-row">
          <label>
            Department Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter department name"
            />
          </label>
          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="department-table-card">
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Department Name</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dep, index) => (
              <tr key={dep.id}>
                <td>{index + 1}</td>
                <td>{dep.name}</td>
                <td>{dep.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(dep)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button>{"<"}</button>
        <button className="active-page">1</button>
        <button>2</button>
        <button>3</button>
        <span className="dots">...</span>
        <button>8</button>
        <button>{">"}</button>
      </div>
    </div>
  );
};

export default Department;
