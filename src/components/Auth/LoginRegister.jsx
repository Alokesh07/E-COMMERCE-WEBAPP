import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import AuthMessageModal from "./AuthMessageModal";
// import foodImage from "../../assets/hello.jpg";
import "./LoginRegister.css";
import { useAuth } from "../../context/AuthContext";

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
const { login } = useAuth();

  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];

  const saveUsers = (users) =>
    localStorage.setItem("users", JSON.stringify(users));

  const handleSignup = (data) => {
    const users = getUsers();

    if (users.some((u) => u.email === data.email)) {
      setMessage("Email already registered. Please login.");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: "user" + Math.floor(10000 + Math.random() * 90000),
      ...data,
    };

    users.push(newUser);
    saveUsers(users);

    setMessage(
      `Registration successful!\nYour username is: ${newUser.username}`
    );
    setActiveTab("login");
  };

const handleLogin = ({ username, password }) => {
  const users = getUsers();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    setMessage("Invalid username or password.");
    return;
  }

  login(user);      
  navigate("/");    
};


  return (
    <div className="login-register-container">
      <div className="background-decoration"></div>

      <div className="content-wrapper">
        {/* IMAGE SECTION */}
        <div className="image-section">
          <div className="image-wrapper">
            <img
              src="https://www.kindpng.com/picc/m/732-7329685_e-commerce-website-background-image-e-commerce-website.png"
              alt="visual"
              className="food-image"
            />
            <div className="image-overlay center-overlay">
              <h1 className="app-title highlight-title">SHOPX</h1>
              <p className="app-subtitle highlight-subtitle">
                Smart shopping starts here
              </p>
            </div>
          </div>
        </div>

        {/* AUTH CARD */}
        {/* <div className="text-center px-4 pt-4">
          <p className="fw-semibold mb-2">Please Login / Register</p>
          <p className="text-muted small">
            to get the ultimate shopping experience
          </p>
        </div> */}
        <div className="card-container">
          <div className="auth-card">
            <div className="tab-container">
              <button
                className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
              <div
                className={`tab-indicator ${
                  activeTab === "login" ? "left" : "right"
                }`}
              />
            </div>

            <div className="form-container">
              {activeTab === "login" ? (
                <LoginForm
                  onSubmit={handleLogin}
                  onSwitchToSignup={() => setActiveTab("signup")}
                />
              ) : (
                <SignupForm
                  onSubmit={handleSignup}
                  onSwitchToLogin={() => setActiveTab("login")}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthMessageModal message={message} onClose={() => setMessage("")} />
    </div>
  );
};

export default LoginRegister;
