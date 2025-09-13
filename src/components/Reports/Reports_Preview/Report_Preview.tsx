import React, { useEffect, useState } from "react";
import "./Report_Preview.css";

type Props = {
  reportType: string;
  dataFetched: boolean;
};

const Report_Preview: React.FC<Props> = ({ reportType, dataFetched }) => {
  const [columns, setColumns] = useState<string[]>([]);
  const [data, setData] = useState<string[][]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Dynamically set table columns and data when Get Data is clicked
  useEffect(() => {
    if (!dataFetched) {
      setColumns([]);
      setData([]);
      setCurrentPage(1);
      return;
    }

    if (reportType === "employee") {
      const cols = Array.from({ length: 20 }, (_, i) => `Col ${i + 1}`);
      const rows = Array.from({ length: 50 }, (_, r) =>
        Array.from({ length: 20 }, (_, c) => `R${r + 1}C${c + 1}`)
      );
      setColumns(cols);
      setData(rows);
    } else if (["attendance", "leave", "absent"].includes(reportType)) {
      const cols = Array.from({ length: 10 }, (_, i) => `Col ${i + 1}`);
      const rows = Array.from({ length: 50 }, (_, r) =>
        Array.from({ length: 10 }, (_, c) => `R${r + 1}C${c + 1}`)
      );
      setColumns(cols);
      setData(rows);
    }
  }, [reportType, dataFetched]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const displayedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="report-preview-container">
      <div className="report-preview-header">
        <h2>Report Preview</h2>
      </div>

      {!dataFetched ? (
        <div className="no-data-message">
          No data to show. Please select a report type and click <strong>Get Data</strong>.
        </div>
      ) : (
        <>
          <div className="table-wrapper-scroll">
            <table className="futuristic-table" style={{ minWidth: reportType === "employee" ? "1200px" : "auto" }}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Report_Preview;
