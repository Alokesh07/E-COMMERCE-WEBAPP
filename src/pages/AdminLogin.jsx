import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const result = login({ username, password });
      if (result.success) {
        navigate("/admin");
      } else {
        setError(result.message);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
        padding: "48px",
        width: "100%",
        maxWidth: "420px"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ 
            fontSize: "32px", 
            fontWeight: "800", 
            color: "#2874f0",
            margin: 0
          }}>
            Shop<span style={{ color: "#ff9f00" }}>X</span>
          </h1>
          <p style={{ 
            color: "#878787", 
            marginTop: "8px",
            fontSize: "14px"
          }}>
            Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User size={18} style={{ 
                position: "absolute", 
                left: "14px", 
                top: "50%", 
                transform: "translateY(-50%)",
                color: "#878787"
              }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 44px",
                  border: "1px solid #dcdcdc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#2874f0"}
                onBlur={(e) => e.target.style.borderColor = "#dcdcdc"}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "500",
              fontSize: "14px"
            }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={18} style={{ 
                position: "absolute", 
                left: "14px", 
                top: "50%", 
                transform: "translateY(-50%)",
                color: "#878787"
              }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  width: "100%",
                  padding: "14px 44px 14px 44px",
                  border: "1px solid #dcdcdc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "#2874f0"}
                onBlur={(e) => e.target.style.borderColor = "#dcdcdc"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#878787"
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: "#ffebee",
              color: "#c62828",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "16px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#ccc" : "#2874f0",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s"
            }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Credentials Info */}
        <div style={{
          marginTop: "24px",
          padding: "16px",
          background: "#f5f5f5",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: "13px", 
            color: "#878787" 
          }}>
            Demo Credentials:
          </p>
          <p style={{ 
            margin: "8px 0 0", 
            fontSize: "14px",
            fontWeight: "500"
          }}>
            Username: <strong>admin</strong> | Password: <strong>admin123</strong>
          </p>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <a 
            href="/" 
            style={{
              color: "#2874f0",
              textDecoration: "none",
              fontSize: "14px"
            }}
          >
            ← Back to Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
