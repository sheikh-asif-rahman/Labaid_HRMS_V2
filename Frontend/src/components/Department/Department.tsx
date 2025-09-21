import React, { useEffect, useState } from "react";
import "./Department.css";
import axios from "axios";
import { API_BASE_URL } from "../../constants/apiBase";
import Popup from "../Popup/Popup";

interface DepartmentData {
  id: number;
  name: string;
  status: number;
}

const Department: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [formData, setFormData] = useState({ name: "", status: "Active" });
  const [editId, setEditId] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Popup
  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const getEmployeeId = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return user.EmployeeId || null;
      } catch {
        return null;
      }
    }
    return null;
  };

  const convertStatus = (status: number) => (status === 1 ? "Active" : "Inactive");

const fetchDepartments = async () => {
  try {
    // Show loading popup
    setPopupType("loading");
    setPopupMessage("Loading departments...");

    const response = await axios.get(`${API_BASE_URL}getDepartmentList`);

    if (response.data.success && Array.isArray(response.data.data)) {
      const data = response.data.data.map((dep: any) => ({
        id: dep.id || dep.DepartmentID,
        name: dep.name || dep.DepartmentName,
        status: Number(dep.status ?? dep.Status),
      }));
      setDepartments(data);
    } else {
      setDepartments([]);
      // Loading popup stays until user reloads or retries
    }

    // Hide loading only on success
    setPopupType(null);
  } catch (err) {
    console.error("Failed to fetch departments", err);
    // Loading popup stays until success
  }
};


  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name) return;

    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert("Employee ID not found. Please login again.");
      return;
    }

    try {
      setPopupType("loading");
      setPopupMessage(editId ? "Updating department..." : "Saving department...");

      const payload: any = {
        type: editId ? "update" : "save",
        name: formData.name.trim(),
        user: employeeId,
      };

      if (editId) {
        payload.id = editId;
        payload.status = formData.status === "Active" ? 1 : 0;
      }

      const response = await axios.post(
        `${API_BASE_URL}updateDepartmentList`,
        payload
      );

      if (response.data.success) {
        await fetchDepartments();
        setFormData({ name: "", status: "Active" });
        setEditId(null);

        setPopupType("done");
        setPopupMessage(editId ? "Department updated successfully!" : "Department saved successfully!");
      } else {
        setPopupType("notdone");
        setPopupMessage(response.data.message || "Operation failed!");
      }
    } catch (err: any) {
      console.error("Failed to save/update department", err);
      setPopupType("notdone");
      setPopupMessage(err.response?.data?.message || "Error saving/updating department");
    }
  };

  const handleEdit = (dep: DepartmentData) => {
    setFormData({ name: dep.name, status: convertStatus(dep.status) });
    setEditId(dep.id);
  };

  // Pagination
  const totalPages = Math.ceil(departments.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = departments.slice(indexOfFirstRow, indexOfLastRow);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? "active-page" : ""}
          onClick={() => changePage(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="department-main-container">
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

      <div className="department-table-card">
        {currentRows.length === 0 ? (
          <p>No departments found.</p>
        ) : (
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
              {currentRows.map((dep, index) => (
                <tr key={`${dep.id}-${index}`}>
                  <td>{indexOfFirstRow + index + 1}</td>
                  <td>{dep.name}</td>
                  <td>{convertStatus(dep.status)}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(dep)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => changePage(currentPage - 1)}>{"<"}</button>
          {renderPagination()}
          <button onClick={() => changePage(currentPage + 1)}>{">"}</button>
        </div>
      )}

      {/* Popup */}
      {popupType && (
        <Popup
          isOpen={true}
          type={popupType}
          message={popupMessage}
          onClose={() => setPopupType(null)}
        />
      )}
    </div>
  );
};

export default Department;
