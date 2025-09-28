import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login/Login";
import Background from "../components/Background/Background";
import axios from "axios";
import { API_BASE_URL } from "../constants/apiBase";

const Login_Page: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (employeeId: string, password: string) => {
    if (!employeeId || !password) {
      setMessage("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}login`, {
        EmployeeId: employeeId,
        Password: password,
      });

      const data = response.data;
      console.log("Login Response:", data);

      // ✅ Case-insensitive check
      if (data.Status.toLowerCase() === "active") {
        const userData = {
          EmployeeId: data.EmployeeId,
          Permission: data.Permission,
          Status: data.Status,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        setMessage("Login successful ✅");

        // Navigate to home
        navigate("/", { replace: true });
      } else {
        setMessage(data.message || "Login failed ❌");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setMessage(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
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
        <Login onLogin={handleLogin} loading={loading} message={message} />
      </div>
    </div>
  );
};

export default Login_Page;
