import React, { useState } from "react";
import "./Login.css";
import buildingImg from "../../assets/Labaid_Building.jpg";
import labaidLogo from "../../assets/LabaidLogo.png";
import { useAuth } from "../../context/AuthContext";

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { loginUser } = useAuth();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = await loginUser(employeeId, password);
    setMessage(msg);

    if (msg === "Login successful" && onLogin) onLogin();
  };

  return (
    <div className="login-app-container">
      <div className="login-app-form">
        <img src={labaidLogo} alt="Labaid Logo" className="login-app-logo" />
        <form onSubmit={handleSubmit}>
          <div className="login-app-form-group">
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="User ID"
              required
            />
          </div>
          <div className="login-app-form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="login-app-submit-btn">
            Login
          </button>
          {message && <p className="login-message">{message}</p>}
        </form>
      </div>

      <div className="login-app-image">
        <img src={buildingImg} alt="Company Building" />
      </div>
    </div>
  );
};

export default Login;
