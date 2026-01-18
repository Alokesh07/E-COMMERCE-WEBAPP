import { useState } from "react";
import { Pencil, Mail, Phone, User, Calendar, BadgeCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileImageUploader from "./ProfileImageUploader";
import Toast from "../common/Toast";
import "../../styles/profile.css";

export default function ProfileInfoPanel() {
  const { user, updateUser } = useAuth();

  const [showEdit, setShowEdit] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [showToast, setShowToast] = useState(false);

  const saveChanges = () => {
    updateUser({ email, phone });
    setShowEdit(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const completionFields = [
    user.profileImage,
    user.email,
    user.phone,
    user.addresses?.length > 0,
  ];

  const completion =
    (completionFields.filter(Boolean).length / completionFields.length) * 100;

  return (
    <>
      {/* PROFILE COMPLETION */}
      <div className="profile-completion mb-4">
        <div className="d-flex justify-content-between mb-1">
          <small className="text-muted">Profile Completion</small>
          <small className="fw-semibold">{Math.round(completion)}%</small>
        </div>
        <div className="progress">
          <div
            className="progress-bar bg-success"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="profile-card">
        {/* NAME */}
        <div className="profile-name-row d-flex align-items-center justify-content-between">
          <h2 className="profile-name d-flex align-items-center gap-2">
            <User size={22} /> {user.name}
          </h2>

          <button
            className="btn btn-light btn-sm"
            title="Edit Profile"
            onClick={() => setShowEdit(true)}
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="profile-main-grid">
          {/* AVATAR */}
          <div className="profile-avatar-col">
            <ProfileImageUploader />
          </div>

          {/* DETAILS */}
          <div className="profile-info-grid">
            <div className="info-item">
              <span className="d-flex align-items-center gap-1">
                <BadgeCheck size={14} /> User ID
              </span>
              <strong>{user.username}</strong>
            </div>

            <div className="info-item">
              <span className="d-flex align-items-center gap-1">
                <Calendar size={14} /> DOB
              </span>
              <strong>{user.dob}</strong>
            </div>

            <div className="info-item">
              <span className="d-flex align-items-center gap-1">
                <Mail size={14} /> Email
              </span>
              <strong>{user.email}</strong>
            </div>

            <div className="info-item">
              <span className="d-flex align-items-center gap-1">
                <Phone size={14} /> Phone
              </span>
              <strong>{user.phone}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL (INLINE STYLED) */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          style={{
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content"
              style={{
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              }}
            >
              <h5
                className="fw-bold mb-4"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Pencil size={18} /> Edit Contact Information
              </h5>

              {/* EMAIL */}
              <div style={{ position: "relative", marginBottom: "16px" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "12px",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  className="form-control"
                  style={{ paddingLeft: "40px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                />
              </div>

              {/* PHONE */}
              <div style={{ position: "relative", marginBottom: "24px" }}>
                <Phone
                  size={16}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "12px",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  className="form-control"
                  style={{ paddingLeft: "40px" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary w-50"
                  onClick={() => setShowEdit(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary w-50" onClick={saveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message="Profile updated successfully" show={showToast} />
    </>
  );
}
