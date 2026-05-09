import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import AuthMessageModal from "./AuthMessageModal";
// import foodImage from "../../assets/hello.jpg";
import "./LoginRegister.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';

const LoginRegister = () => {
  const [view, setView] = useState("login"); // 'login' | 'signup' | 'forgot'
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // const handleSignup = (data) => {
  //   const users = getUsers();

  //   if (users.some((u) => u.email === data.email)) {
  //     setMessage("Email already registered. Please login.");
  //     return;
  //   }

  //   const newUser = {
  //     id: Date.now(),
  //     username: "user" + Math.floor(10000 + Math.random() * 90000),
  //     ...data,
  //   };

  //   users.push(newUser);
  //   saveUsers(users);

  //   setMessage(
  //     `Registration successful!\nYour username is: ${newUser.username}`
  //   );
  //   setActiveTab("login");
  // };
  const { register } = useAuth();

  const handleSignup = async (data) => {
    setMessage('');
    const resp = await register(data);
    if (resp.success) {
      setMessage('Registration successful. You are now logged in.');
      setView('login');
    } else {
      setMessage(resp.message || 'Registration failed');
    }
  };

  const handleLogin = async ({ email, password }) => {
    setMessage('');
    const resp = await login({ email, password });
    if (resp.success) {
      navigate('/');
    } else {
      setMessage(resp.message || 'Login failed');
    }
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
            {view !== "forgot" && (
              <div className="tab-container">
                <button
                  className={`tab-btn ${view === "login" ? "active" : ""}`}
                  onClick={() => setView("login")}
                >
                  Login
                </button>
                <button
                  className={`tab-btn ${view === "signup" ? "active" : ""}`}
                  onClick={() => setView("signup")}
                >
                  Sign Up
                </button>
                <div
                  className={`tab-indicator ${
                    view === "login" ? "left" : "right"
                  }`}
                />
              </div>
            )}

            <div className="form-container">
              {view === "forgot" ? (
                <ForgotPasswordForm
                  onGoBack={() => setView("login")}
                  onSwitchToLogin={() => setView("login")}
                  onClose={() => setView("login")}
                />
              ) : view === "login" ? (
                <LoginForm
                  onSubmit={handleLogin}
                  onSwitchToSignup={() => setView("signup")}
                  onShowForgot={() => setView("forgot")}
                />
              ) : (
                <SignupForm
                  onSubmit={handleSignup}
                  onSwitchToLogin={() => setView("login")}
                />
              )}
            </div>
            <div className="px-3 mt-2 text-center">
              <small className="text-muted">Looking for admin access?</small>
              <div>
                <Link to="/admin-login" className="btn btn-link small">
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthMessageModal message={message} onClose={() => setMessage("")} />
    </div>
  );
};

export default LoginRegister;
