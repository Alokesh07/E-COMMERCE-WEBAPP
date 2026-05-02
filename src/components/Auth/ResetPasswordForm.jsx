import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import { sendLog } from '../../utils/logger';

// ResetPasswordForm is used both as a standalone route and inside a modal.
// It prefers a `token` prop if provided; otherwise it reads the `token` query param.

export default function ResetPasswordForm({ token: propToken, onClose }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = propToken || searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.resetPassword(token, newPassword);
      setMessage(response.message);
      // send a device notification
      try {
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('Password reset', { body: response.message });
        } else if (window.Notification && Notification.permission !== 'denied') {
          Notification.requestPermission().then((perm) => {
            if (perm === 'granted') new Notification('Password reset', { body: response.message });
          });
        }
      } catch (notifErr) {
        // ignore notification errors
      }

      // log event to backend log file
      sendLog('info', `Password reset succeeded for token=${token}`);

      // close modal if requested or navigate to auth/login
      setTimeout(() => {
        if (typeof onClose === 'function') onClose();
        navigate('/auth');
      }, 1200);
    } catch (err) {
      const msg = err.message || 'Failed to reset password';
      setError(msg);
      sendLog('error', `Password reset failed for token=${token} - ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <div className="alert alert-danger" role="alert">
          Invalid or missing reset token. Please request a new password reset link.
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-modal-overlay">
      <div className="reset-password-container modal-card">
      <div className="text-center mb-4">
        <h4 className="fw-bold" style={{ color: '#6366f1' }}>Set New Password</h4>
        <p className="text-muted small">Enter your new password below</p>
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
            type="password"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            style={{ padding: '12px' }}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {onClose && (
        <div className="text-center mt-3">
          <button className="btn btn-link small" onClick={onClose}>Close</button>
        </div>
      )}
      </div>
    </div>
  );
}
