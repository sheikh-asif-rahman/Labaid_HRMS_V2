import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AttendanceReportForm from "../Report_Form/Attendance_Report_Form";
import LeaveReportForm from "../Report_Form/Leave_Report_Form";
import EmployeeListReportForm from "../Report_Form/Employee_List_Form";
import AbsentReportForm from "../Report_Form/Absent_Report_Form";
import "./Report_Slider.css";

type Props = {
  reportType: string;
  onGetReport: (formData: any) => void;
  isReportGenerated?: boolean;
};

const Report_Slider: React.FC<Props> = ({
  reportType,
  onGetReport,
  isReportGenerated,
}) => {
  return (
    <div className="report-slider">
      <AnimatePresence mode="wait">
        <motion.div
          key={reportType}
          initial={{ x: 300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "tween", duration: 0.4 }}
        >
          {reportType === "attendance" && (
            <AttendanceReportForm
              onSubmit={onGetReport}
              buttonText={isReportGenerated ? "Reset" : "Get Report"}
            />
          )}
          {reportType === "leave" && (
            <LeaveReportForm
              onSubmit={onGetReport}
              buttonText={isReportGenerated ? "Reset" : "Get Report"}
            />
          )}
          {reportType === "employee-list" && (
            <EmployeeListReportForm
              onSubmit={onGetReport}
              buttonText={isReportGenerated ? "Reset" : "Get Report"}
            />
          )}
          {reportType === "absent" && (
            <AbsentReportForm
              onSubmit={onGetReport}
              buttonText={isReportGenerated ? "Reset" : "Get Report"}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Report_Slider;
