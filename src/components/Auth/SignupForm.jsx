import { useState } from "react";

export default function SignupForm({ onSubmit, onSwitchToLogin }) {
  const [error, setError] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters";

    if (!/^[A-Za-z]/.test(password)) return "Password must start with a letter";

    if (!/[A-Z]/.test(password))
      return "Password must contain at least one uppercase letter";

    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";

    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must contain at least one special character";

    return "";
  };

  const generateUsername = (name) => {
    const firstName = name.trim().split(" ")[0].toLowerCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${firstName}${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const dob = form.dob.value;
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const username = generateUsername(name);
    setGeneratedUsername(username);

    onSubmit({
      name,
      email,
      dob,
      phone,
      address,
      password,
      username,
    });
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(generatedUsername);
    alert("Username copied to clipboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        className="form-control mb-2"
        placeholder="Full Name"
        required
      />

      <input
        name="email"
        className="form-control mb-2"
        placeholder="Email"
        required
      />

      <input type="date" name="dob" className="form-control mb-2" required />

      <input
        name="phone"
        className="form-control mb-2"
        placeholder="Phone"
        required
      />

      <textarea
        name="address"
        className="form-control mb-2"
        placeholder="Address"
      />

      <input
        type="password"
        name="password"
        className="form-control mb-2"
        placeholder="Password"
        required
      />

      <input
        type="password"
        name="confirmPassword"
        className="form-control mb-2"
        placeholder="Confirm Password"
        required
      />

      {error && <div className="alert alert-danger py-2 small">{error}</div>}

      {generatedUsername && (
        <div className="alert alert-info py-2 d-flex justify-content-between align-items-center">
          <span>
            Your User ID: <strong>{generatedUsername}</strong>
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-dark"
            onClick={copyUsername}
          >
            Copy
          </button>
        </div>
      )}

      <button className="btn btn-primary w-100 mt-2">Register</button>

      <p className="text-center mt-3 small">
        Existing user?{" "}
        <span className="text-primary cursor-pointer" onClick={onSwitchToLogin}>
          Login
        </span>
      </p>
    </form>
  );
}
