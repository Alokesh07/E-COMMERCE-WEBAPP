import { useState } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileImageUploader from "./ProfileImageUploader";

export default function ProfileInfoPanel() {
  const { user, updateUser } = useAuth();

  const [showEdit, setShowEdit] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const saveChanges = () => {
    updateUser({ email, phone });
    setShowEdit(false);
  };

  return (
    <>
      <div className="card p-4 shadow-sm position-relative">
        <h4 className="fw-bold mb-3">Profile Information</h4>

        {/* EDIT ICON */}
        <button
          className="btn btn-light position-absolute top-0 end-0 m-3"
          onClick={() => setShowEdit(true)}
          title="Edit profile"
        >
          <Pencil size={18} />
        </button>

        <ProfileImageUploader />

        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>User ID:</strong> {user.username}
        </p>
        <p>
          <strong>DOB:</strong> {user.dob}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="fw-bold mb-3">Edit Profile</h5>

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
    </>
  );
}
