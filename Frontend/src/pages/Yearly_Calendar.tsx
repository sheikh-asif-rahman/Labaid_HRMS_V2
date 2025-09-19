import React from "react";
import Yearly_Calender from "../components/Yearly_Calender/Yearly_Calender"; // adjust path if needed

const Yearly_Calendar: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflowY: "auto", // allows scrolling if content grows
      }}
    >
      {/* Call the full Yearly_Calender component */}
      <Yearly_Calender />
    </div>
  );
};

export default Yearly_Calendar;
