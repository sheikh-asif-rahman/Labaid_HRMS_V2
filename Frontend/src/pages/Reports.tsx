import React, { useState } from "react";
import Reports_Form from "../components/Reports/Reports_Form/Reports_Form"; 
import Report_Preview from "../components/Reports/Reports_Preview/Report_Preview"; 

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState("");   // lifted state
  const [dataFetched, setDataFetched] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Reports_Form
        reportType={reportType}
        setReportType={setReportType}
        dataFetched={dataFetched}
        setDataFetched={setDataFetched}
      />
      <Report_Preview reportType={reportType} dataFetched={dataFetched} />
    </div>
  );
};

export default Reports;
