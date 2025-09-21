import React, { useState } from "react";
import Search from "../components/Search/Search";
import Rules_Permission_Form from "../components/Rules_Permission/Rules_Permission";
import axios from "axios";
import { API_BASE_URL } from "../constants/apiBase";
import Popup from "../components/Popup/Popup";

const Rules_Permission: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [popupType, setPopupType] = useState<"loading" | "done" | "notdone" | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const handleNew = () => {
    setEmployeeData(null);
  };

  const handleSearch = async (employeeId: string) => {
    try {
      setPopupType("loading");
      setPopupMessage("Searching...");

      const response = await axios.get(`${API_BASE_URL}getEmployeeAccessData?employeeId=${employeeId}`);
      setEmployeeData(response.data);

      setPopupType("done");
      setPopupMessage("Search completed!");
    } catch (error) {
      console.error(error);
      setPopupType("notdone");
      setPopupMessage("Search failed!");
    }
  };

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
        overflowY: "auto",
      }}
    >
      <Search
        placeholder="Search employees..."
        onNew={handleNew}
        onSearch={handleSearch}
      />

      <Rules_Permission_Form employeeData={employeeData} />

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

export default Rules_Permission;
