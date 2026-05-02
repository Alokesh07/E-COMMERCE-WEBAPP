import { useState } from 'react';
import { authAPI } from '../../utils/api';
import { sendLog } from '../../utils/logger';

export default function ForgotPasswordForm({ onSwitchToLogin, onSwitchToReset }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.forgotPassword(emailOrPhone);
      setMessage(response.message);
      sendLog('info', `Password reset requested for ${emailOrPhone}`);
    } catch (err) {
      const msg = err.message || 'Failed to process request';
      setError(msg);
      sendLog('error', `Forgot password failed for ${emailOrPhone} - ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="text-center mb-4">
        <h4 className="fw-bold" style={{ color: '#6366f1' }}>Reset Your Password</h4>
        <p className="text-muted small">Enter your email or phone number to receive a password reset link</p>
      </div>

      {message && (
        <div className="alert alert-success py-2 small" role="alert">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2 small" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Email or Phone Number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
            style={{ padding: '12px' }}
          />
        </div>

        <button
          type="submit"
          className="btn w-100"
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '12px',
            fontWeight: '600'
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center mt-3">
        <span className="text-muted small">Remember your password? </span>
        <span
          className="text-primary cursor-pointer fw-semibold"
          onClick={onSwitchToLogin}
          style={{ cursor: 'pointer' }}
        >
          Login here
        </span>
      </div>
    </div>
  );
}
