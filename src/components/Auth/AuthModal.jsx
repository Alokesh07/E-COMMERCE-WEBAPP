import { useState } from "react";
import LoginTab from "./LoginTab";
import SignUpTab from "./SignUpTab";

export default function AuthModal({ show, onClose }) {
  const [activeTab, setActiveTab] = useState("login");

  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">

          <div className="row g-0">
            {/* IMAGE SIDE */}
            <div className="col-md-5 d-none d-md-block">
              <img
                src="/images/auth-side.jpg"
                alt="auth"
                className="img-fluid h-100"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* FORM SIDE */}
            <div className="col-md-7 p-4">
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => setActiveTab("login")}
                  >
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "signup" ? "active" : ""}`}
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign Up
                  </button>
                </li>
              </ul>

              {activeTab === "login" ? (
                <LoginTab switchToSignup={() => setActiveTab("signup")} onClose={onClose} />
              ) : (
                <SignUpTab switchToLogin={() => setActiveTab("login")} />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
