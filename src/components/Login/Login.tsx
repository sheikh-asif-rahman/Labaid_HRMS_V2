import React from "react";
import "./Login.css";
import buildingImg from "../../assets/Labaid_Building.jpg"; // Right side building
import labaidLogo from "../../assets/LabaidLogo.png"; // Centered logo

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(); // trigger login in App
  };

  return (
    <div className="login-container">
      {/* Left Side: Minimalistic Form */}
      <div className="login-form">
        <img src={labaidLogo} alt="Labaid Logo" className="logo" />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" id="userId" placeholder="User ID" />
          </div>
          <div className="form-group">
            <input type="password" id="password" placeholder="Password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>

      {/* Right Side: Building Image */}
      <div className="login-image">
        <img src={buildingImg} alt="Company Building" />
      </div>
    </div>
  );
};

export default Login;
