import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutConfirmModal({ show, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!show) return null;

  const confirm = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 text-center">
          <h5 className="fw-bold mb-2">Logout?</h5>
          <p className="text-muted mb-3">
            You’ll need to login again to access your account.
          </p>

          <div className="d-flex gap-2">
            <button className="btn btn-secondary w-50" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger w-50" onClick={confirm}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
