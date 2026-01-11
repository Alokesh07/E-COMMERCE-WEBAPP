export default function SignupForm({ onSubmit, onSwitchToLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      address: e.target.address.value,
      password: e.target.password.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" className="form-control mb-2" placeholder="Full Name" required />
      <input name="email" className="form-control mb-2" placeholder="Email" required />
      <input name="phone" className="form-control mb-2" placeholder="Phone" required />
      <textarea name="address" className="form-control mb-2" placeholder="Address" />
      <input type="password" name="password" className="form-control mb-2" placeholder="Password" required />

      <button className="btn btn-primary w-100">Register</button>

      <p className="text-center mt-3 small">
        Existing user?{" "}
        <span className="text-primary cursor-pointer" onClick={onSwitchToLogin}>
          Login
        </span>
      </p>
    </form>
  );
}
