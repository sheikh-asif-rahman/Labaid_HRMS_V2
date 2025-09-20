import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login/Login";
import Background from "../components/Background/Background";

const Login_Page: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // সবসময় home page redirect
    navigate("/", { replace: true });
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
      <Background />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "900px",
          zIndex: 1,
        }}
      >
        <Login onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Login_Page;
