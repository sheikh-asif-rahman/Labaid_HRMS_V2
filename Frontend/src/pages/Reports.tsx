import React, { useState } from "react";
import Reports_Form from "../components/Reports/Reports_Form/Reports_Form";
import Report_Preview from "../components/Reports/Reports_Preview/Report_Preview";

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState("");
  const [dataFetched, setDataFetched] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);

  return (
    <div>
      <Reports_Form
        reportType={reportType}
        setReportType={setReportType}
        dataFetched={dataFetched}
        setDataFetched={setDataFetched}
        setReportData={setReportData}
      />
      <Report_Preview
        reportType={reportType}
        dataFetched={dataFetched}
        reportData={reportData}
      />
    </div>
  );
};

export default Reports;
