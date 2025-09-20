import React, { useState } from "react";
import "./Login.css";
import buildingImg from "../../assets/Labaid_Building.jpg";
import labaidLogo from "../../assets/LabaidLogo.png";

interface LoginProps {
  onLogin: (employeeId: string, password: string) => void;
  loading?: boolean;
  message?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading, message }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(employeeId, password);
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
          <button type="submit" className="login-app-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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
