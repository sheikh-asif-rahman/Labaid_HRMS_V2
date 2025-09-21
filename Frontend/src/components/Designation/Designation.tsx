import React, { useEffect, useState } from "react";
import "./Designation.css";
import axios from "axios";
import { API_BASE_URL } from "../../constants/apiBase";
import Popup from "../Popup/Popup";

interface DesignationData {
  id: number;
  name: string;
  status: number; // 1 = Active, 0 = Inactive
}

const Designation_Setup: React.FC = () => {
  const [designationList, setDesignationList] = useState<DesignationData[]>([]);
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

  const fetchDesignations = async () => {
    try {
      setPopupType("loading");
      setPopupMessage("Loading designations...");

      const response = await axios.get(`${API_BASE_URL}getDesignationList`);

      if (response.data.success && Array.isArray(response.data.data)) {
        const data = response.data.data.map((des: any) => ({
          id: des.id || des.DesignationID,
          name: des.name || des.DesignationName,
          status: Number(des.status ?? des.Status),
        }));
        setDesignationList(data);
      } else {
        setDesignationList([]);
      }

      setPopupType(null);
    } catch (err) {
      console.error("Failed to fetch designations", err);
      // Loading popup stays until success
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setPopupMessage(editId ? "Updating designation..." : "Saving designation...");

      const payload: any = {
        type: editId ? "update" : "save",
        name: formData.name.trim(),
        user: employeeId,
      };

      if (editId) {
        payload.id = editId;
        payload.status = formData.status === "Active" ? 1 : 0;
      }

      const response = await axios.post(`${API_BASE_URL}updateDesignationList`, payload);

      if (response.data.success) {
        await fetchDesignations();
        setFormData({ name: "", status: "Active" });
        setEditId(null);

        // show done popup
        setPopupType("done");
        setPopupMessage(editId ? "Designation updated successfully!" : "Designation saved successfully!");
      } else {
        setPopupType("notdone");
        setPopupMessage(response.data.message || "Operation failed!");
      }
    } catch (err: any) {
      console.error("Failed to save/update designation", err);
      setPopupType("notdone");
      setPopupMessage(err.response?.data?.message || "Error saving/updating designation");
    }
  };

  const handleEdit = (des: DesignationData) => {
    setFormData({ name: des.name, status: convertStatus(des.status) });
    setEditId(des.id);
  };

  // Pagination
  const totalPages = Math.ceil(designationList.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = designationList.slice(indexOfFirstRow, indexOfLastRow);

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
    <div className="designation-main-container">
      <div className="designation-header">
        <h2>Designation Setup</h2>
        <button
          className={formData.name ? "active-btn" : "disabled-btn"}
          onClick={handleSave}
          disabled={!formData.name}
        >
          {editId !== null ? "Update" : "Save"}
        </button>
      </div>

      <div className="designation-form-card">
        <div className="form-row">
          <label>
            Designation Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter designation name"
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

      <div className="designation-table-card">
        {currentRows.length === 0 ? (
          <p>No designations found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Designation Name</th>
                <th>Status</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((des, index) => (
                <tr key={`${des.id}-${index}`}>
                  <td>{indexOfFirstRow + index + 1}</td>
                  <td>{des.name}</td>
                  <td>{convertStatus(des.status)}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(des)}>
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

export default Designation_Setup;
