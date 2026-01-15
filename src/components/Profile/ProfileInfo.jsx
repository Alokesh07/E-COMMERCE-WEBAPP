import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileImageUploader from "./ProfileImageUploader";

export default function ProfileInfo() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const saveChanges = () => {
    updateUser({ email, phone });
  };

  return (
    <div className="card p-3 h-100 shadow-sm">
      <h5 className="fw-bold mb-3">Profile Info</h5>

      <ProfileImageUploader />

      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>User ID:</strong> {user.username}
      </p>

      <input
        className="form-control mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="form-control mb-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={saveChanges}>
        Save Changes
      </button>
    </div>
  );
}
