import React from "react";
import Search from "../components/Search/Search";
import RulesPermissionForm from "../components/Rules_Permission/Rules_Permission"; // adjust the path if needed

const Rules_Permission: React.FC = () => {
  const handleSearch = (query: string) => console.log("Search:", query);
  const handleNew = () => console.log("New clicked");

  return (
    <div
      style={{
        minHeight: "100vh",       // allow content to grow
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflowY: "auto",        // enable vertical scrolling
      }}
    >
      {/* Search */}
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <Search
          placeholder="Search employees..."
          onSearch={handleSearch}
          onNew={handleNew}
        />
      </div>

      {/* Rules & Permission Form */}
      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <RulesPermissionForm />
      </div>
    </div>
  );
};

export default Rules_Permission;
