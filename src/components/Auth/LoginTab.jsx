import { useAuth } from "../../context/AuthContext";

export default function LoginTab({ switchToSignup, onClose }) {
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const form = e.target;

    const username = form.username.value;
    const password = form.password.value;

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      alert("Invalid credentials");
      return;
    }

    login(user);
    onClose();
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="username" className="form-control mb-2" placeholder="Username" required />
      <input type="password" name="password" className="form-control mb-2" placeholder="Password" required />

      <button className="btn btn-dark w-100">Login</button>

      <p className="text-center mt-2 small text-muted">
        Forgot Password? (Mocked)
      </p>

      <p className="text-center mt-3 small">
        New to ShopX?{" "}
        <span className="text-primary cursor-pointer" onClick={switchToSignup}>
          Register here
        </span>
      </p>
    </form>
  );
}
