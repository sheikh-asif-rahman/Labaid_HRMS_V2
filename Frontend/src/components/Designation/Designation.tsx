import React, { useState } from "react";
import "./Designation.css";

interface DesignationItem {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

const Designation_Setup: React.FC = () => {
  // Example data: 80 items for demo
  const initialList: DesignationItem[] = Array.from({ length: 80 }, (_, i) => ({
    id: i + 1,
    name: `Designation ${i + 1}`,
    status: i % 2 === 0 ? "Active" : "Inactive",
  }));

  const [designationList, setDesignationList] = useState<DesignationItem[]>(initialList);
  const [formData, setFormData] = useState({ id: 0, name: "", status: "Active" });
  const [isEdit, setIsEdit] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(designationList.length / itemsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;
    const newDesignation = {
      id: designationList.length + 1,
      name: formData.name,
      status: formData.status as "Active" | "Inactive",
    };
    setDesignationList([...designationList, newDesignation]);
    setFormData({ id: 0, name: "", status: "Active" });
    setCurrentPage(totalPages); // go to last page
  };

  const handleUpdate = () => {
    setDesignationList(
      designationList.map((item) =>
        item.id === formData.id ? { ...item, name: formData.name, status: formData.status as "Active" | "Inactive" } : item
      )
    );
    setFormData({ id: 0, name: "", status: "Active" });
    setIsEdit(false);
  };

  const handleEdit = (item: DesignationItem) => {
    setFormData(item);
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Pagination helpers
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const currentItems = designationList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="designation-main-container">
      {/* Header */}
      <div className="designation-header">
        <h2>Designation Setup</h2>
        <button
          onClick={isEdit ? handleUpdate : handleSave}
          disabled={!formData.name.trim()}
          className={formData.name.trim() ? "active-btn" : "disabled-btn"}
        >
          {isEdit ? "Update" : "Save"}
        </button>
      </div>

      {/* Form */}
      <div className="designation-form-card">
        <div className="form-row">
          <label>
            Designation Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter designation"
            />
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="designation-table-card">
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
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.name}</td>
                <td>{item.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
            .map((page, index, arr) => (
              <React.Fragment key={page}>
                {index > 0 && page - arr[index - 1] > 1 && <span className="dots">...</span>}
                <button
                  onClick={() => paginate(page)}
                  className={currentPage === page ? "active-page" : ""}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Designation_Setup;
