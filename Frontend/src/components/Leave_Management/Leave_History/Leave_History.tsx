import React, { useState } from "react";
import "./Leave_History.css";

interface LeaveHistoryItem {
  sl: number;
  applicationDate: string;
  purpose: string;
  totalLeave: number;
  fromDate: string;
  toDate: string;
  alternativePerson: string;
  status: "Approved" | "Rejected" | "Pending";
}

const Leave_History: React.FC = () => {
  // Dummy big data
  const leaveData: LeaveHistoryItem[] = Array.from({ length: 45 }, (_, i) => ({
    sl: i + 1,
    applicationDate: "2025-09-10",
    purpose: `Purpose ${i + 1}`,
    totalLeave: Math.floor(Math.random() * 5) + 1,
    fromDate: "2025-09-12",
    toDate: "2025-09-13",
    alternativePerson: "John Doe",
    status: (i % 3 === 0
      ? "Approved"
      : i % 3 === 1
      ? "Rejected"
      : "Pending") as "Approved" | "Rejected" | "Pending",
  })).reverse(); // newest first

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(leaveData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = leaveData.slice(startIndex, startIndex + rowsPerPage);

  const handleDownload = (item: LeaveHistoryItem) => {
    alert(`Download leave record for SL: ${item.sl}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return (
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          {"<"}
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} className="dots">
              ...
            </span>
          ) : (
            <button
              key={i}
              className={p === currentPage ? "active" : ""}
              onClick={() => handlePageChange(p as number)}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    );
  };

  return (
    <div className="leave-history-container">
      <div className="leave-history-header">
        <h2>Leave History</h2>
      </div>

      <div className="table-wrapper">
        <table className="leave-history-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Application Date</th>
              <th>Purpose</th>
              <th>Total Leave</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Alternative Person</th>
              <th>Status</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => {
              // Only absolute first row globally is active
              const isGlobalFirst = startIndex + index === 0;

              return (
                <tr key={item.sl}>
                  <td>{item.sl}</td>
                  <td>{item.applicationDate}</td>
                  <td>{item.purpose}</td>
                  <td>{item.totalLeave}</td>
                  <td>{item.fromDate}</td>
                  <td>{item.toDate}</td>
                  <td>{item.alternativePerson}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`download-btn ${!isGlobalFirst ? "disabled" : ""}`}
                      onClick={() => isGlobalFirst && handleDownload(item)}
                      disabled={!isGlobalFirst}
                      title={!isGlobalFirst ? "Only the newest record can be downloaded" : ""}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
};

export default Leave_History;
