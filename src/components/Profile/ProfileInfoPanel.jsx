import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileImageUploader from "./ProfileImageUploader";

export default function ProfileInfoPanel() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);

  const save = () => {
    updateUser({ email, phone });
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="fw-bold mb-3">Profile Information</h4>

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

      <input
        className="form-control mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="form-control mb-3"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button className="btn btn-primary" onClick={save}>
        Save Changes
      </button>
    </div>
  );
}
