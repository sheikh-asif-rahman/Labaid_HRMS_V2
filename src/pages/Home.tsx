// src/pages/Home.tsx
import React from "react";
import Current_Month_Status from "../components/Home/Current_Month_Status/Current_Month_Status";
import Recent_Applications from "../components/Home/Recent_Applications/Recent_Applications";
import Profile from "../components/Home/Profile/Profile"; // import profile component

const Home: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        gap: "20px",
        overflow: "hidden", // prevent page scrollbar
      }}
    >
      {/* Left Column - 70% width */}
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflow: "hidden",
        }}
      >
        <Current_Month_Status />
        <Recent_Applications />
      </div>

      {/* Right Column - 30% width */}
      <div
        style={{
          width: "30%",
        }}
      >
        <Profile />
      </div>
    </div>
  );
};

export default Home;
