import { useState } from "react";
import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ProfileCameraCapture from "./ProfileCameraCapture";

export default function ProfileImageUploader() {
  const { user } = useAuth();
  const [showCamera, setShowCamera] = useState(false);

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-3">
        <img
          src={user?.profileImage || "/images/user-placeholder.png"}
          alt="Profile"
          className="rounded-circle border"
          width={80}
          height={80}
          style={{ objectFit: "cover" }}
        />

        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2"
          onClick={() => setShowCamera(true)}
        >
          <Camera size={16} />
          Capture Photo
        </button>
      </div>

      {showCamera && (
        <ProfileCameraCapture onClose={() => setShowCamera(false)} />
      )}
    </>
  );
}
