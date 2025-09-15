import React from "react";
import Login from "../components/Login/Login"; // Adjust path if needed
import Background from "../components/Background/Background"; // Import the bubble background

interface LoginPageProps {
  onLogin?: () => void;
}

const Login_Page: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div
      style={{
        position: "relative",   // allow absolute background
        width: "100%",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Bubbles */}
      <Background />

      {/* Login Form centered */}
      <div
        style={{
          position: "absolute",  // float above background
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "900px",
          zIndex: 1,            // ensure it is above bubbles
        }}
      >
        <Login onLogin={onLogin || (() => {})} />
      </div>
    </div>
  );
};

export default Login_Page;
