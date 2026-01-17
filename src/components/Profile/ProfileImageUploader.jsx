import { useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileCameraCapture from "./ProfileCameraCapture";
import "../../styles/profile.css";

export default function ProfileImageUploader() {
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);

  return (
    <>
      <div className="avatar-section">
        <div className="avatar-wrapper">
          <img
            src={user?.profileImage || "/images/user-placeholder.png"}
            alt="Profile Avatar"
            className="avatar-image"
          />

          {/* CAMERA ACTION */}
          <button
            className="avatar-btn"
            title="Capture profile photo"
            onClick={() => setShowCamera(true)}
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="avatar-text">
          <strong>Profile Photo</strong>
          <span>Click camera icon to update</span>
        </div>
      </div>

      {showCamera && (
        <ProfileCameraCapture onClose={() => setShowCamera(false)} />
      )}
    </>
  );
}
