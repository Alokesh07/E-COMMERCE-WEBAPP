export default function LoginForm({ onSubmit, onSwitchToSignup }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      username: e.target.username.value,
      password: e.target.password.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" className="form-control mb-2" placeholder="Username" required />
      <input type="password" name="password" className="form-control mb-2" placeholder="Password" required />

      <button className="btn btn-dark w-100">Login</button>

      <p className="text-center mt-2 small text-muted">
        Forgot Password? (Mocked)
      </p>

      <p className="text-center mt-3 small">
        New to ShopX?{" "}
        <span className="text-primary cursor-pointer" onClick={onSwitchToSignup}>
          Register here
        </span>
      </p>
    </form>
  );
}
