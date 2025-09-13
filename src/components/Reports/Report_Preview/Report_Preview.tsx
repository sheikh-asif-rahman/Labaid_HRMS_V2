import React from "react";
import "./Report_Preview.css";

type Props = {
  data: any[];
  columns: string[];
  isVisible?: boolean;
};

const ReportPreview: React.FC<Props> = ({ data, columns, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="report-preview-container">
      <div className="report-preview-header">
        <h3>Preview Report</h3>
        <button className="download-btn">Download</button>
      </div>

      <div className="report-table-wrapper">
        <div className="report-table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <button disabled>Prev</button>
        <button>Next</button>
      </div>
    </div>
  );
};

export default ReportPreview;
