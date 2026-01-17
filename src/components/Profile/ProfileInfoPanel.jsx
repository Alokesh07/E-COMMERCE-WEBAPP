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
        {/* HEADER */}
        <div className="profile-card-header">
          <h4 className="m-0">Profile Information</h4>

          <button
            className="icon-btn"
            title="Edit Profile"
            onClick={() => setShowEdit(true)}
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* TOP SECTION */}
        <div className="profile-top">
          <ProfileImageUploader />

          <div className="profile-meta">
            <div className="meta-row">
              <User size={14} />
              <div>
                <span>Name</span>
                <strong>{user.name}</strong>
              </div>
            </div>

            <div className="meta-row">
              <BadgeCheck size={14} />
              <div>
                <span>User ID</span>
                <strong>{user.username}</strong>
              </div>
            </div>

            <div className="meta-row">
              <Calendar size={14} />
              <div>
                <span>DOB</span>
                <strong>{user.dob}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <hr className="profile-divider" />

        {/* CONTACT INFO */}
        <div className="profile-details">
          <div className="detail-item">
            <Mail size={16} />
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
          </div>

          <div className="detail-item">
            <Phone size={16} />
            <div>
              <span>Phone</span>
              <strong>{user.phone}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="fw-bold mb-3">Edit Contact Information</h5>

              <input
                className="form-control mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />

              <input
                className="form-control mb-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
              />

              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary w-50"
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
