export default function SignUpTab({ switchToLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const form = e.target;

    const email = form.email.value;

    if (users.find(u => u.email === email)) {
      alert("Email already exists!");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: "user" + Math.floor(Math.random() * 100000),
      name: form.name.value,
      email,
      phone: form.phone.value,
      password: form.password.value,
      address: form.address.value,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert(`Registered successfully!\nYour username: ${newUser.username}`);
    switchToLogin();
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
        <span className="text-primary cursor-pointer" onClick={switchToLogin}>
          Login
        </span>
      </p>
    </form>
  );
}
