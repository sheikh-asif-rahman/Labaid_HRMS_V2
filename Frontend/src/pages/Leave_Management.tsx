import React from "react";
import Search from "../components/Search/Search"; 
import Leave_Application from "../components/Leave_Management/Leave_Application/Leave_Application"; 
import Leave_History from "../components/Leave_Management/Leave_History/Leave_History"; 

const Leave_Management: React.FC = () => {

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // implement your search logic here
  };

  const handleNew = () => {
    console.log("New leave application triggered");
    // implement your "New" logic here
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Search component */}
      <Search onSearch={handleSearch} onNew={handleNew} />

      {/* Space */}
      <div style={{ height: "20px" }} />

      {/* Leave Application form */}
      <Leave_Application />

      {/* Space */}
      <div style={{ height: "20px" }} />

      {/* Leave History table */}
      <Leave_History />
    </div>
  );
};

export default Leave_Management;
