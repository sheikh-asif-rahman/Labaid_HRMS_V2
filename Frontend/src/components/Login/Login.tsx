import React from "react";
import "./Login.css";
import buildingImg from "../../assets/Labaid_Building.jpg";
import labaidLogo from "../../assets/LabaidLogo.png";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(); // trigger login in App
  };

  return (
    <div className="login-app-container">
      {/* Left Side: Minimalistic Form */}
      <div className="login-app-form">
        <img src={labaidLogo} alt="Labaid Logo" className="login-app-logo" />
        <form onSubmit={handleSubmit}>
          <div className="login-app-form-group">
            <input type="text" id="userId" placeholder="User ID" />
          </div>
          <div className="login-app-form-group">
            <input type="password" id="password" placeholder="Password" />
          </div>
          <button type="submit" className="login-app-submit-btn">Login</button>
        </form>
      </div>

      {/* Right Side: Building Image */}
      <div className="login-app-image">
        <img src={buildingImg} alt="Company Building" />
      </div>
    </div>
  );
};

export default Login;
