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
      <div className="mb-3">
        <input 
          name="username" 
          className="form-control" 
          placeholder="Username" 
          required 
          style={{ padding: '12px' }}
        />
      </div>
      <div className="mb-3">
        <input 
          type="password" 
          name="password" 
          className="form-control" 
          placeholder="Password" 
          required 
          style={{ padding: '12px' }}
        />
      </div>

      <button 
        className="btn w-100" 
        style={{ 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
          padding: '12px',
          fontWeight: '600'
        }}
      >
        Login
      </button>

      <p className="text-center mt-3 small text-muted">
        Forgot Password? <a href="#" className="text-primary">Reset here</a>
      </p>

      <div className="text-center mt-3">
        <span className="text-muted small">New to ShopX? </span>
        <span 
          className="text-primary cursor-pointer fw-semibold" 
          onClick={onSwitchToSignup}
          style={{ cursor: 'pointer' }}
        >
          Register here
        </span>
      </div>
      
      {/* Demo credentials hint */}
      <div className="mt-4 p-3 bg-light rounded text-center">
        <p className="mb-1 small text-muted">Demo Credentials:</p>
        <p className="mb-0 small">
          <strong>Username:</strong> demo | <strong>Password:</strong> demo123
        </p>
      </div>
    </form>
  );
}
