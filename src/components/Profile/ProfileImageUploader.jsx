import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileImageUploader() {
  const { user, updateUser } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      updateUser({
        profileImage: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="text-center mb-4">
      {/* PROFILE IMAGE */}
      <div
        className="position-relative mx-auto mb-2"
        style={{ width: 120, height: 120 }}
      >
        <img
          src={user.profileImage || "/images/user-placeholder.png"}
          alt="Profile"
          className="rounded-circle border shadow-sm"
          width="120"
          height="120"
          style={{ objectFit: "cover" }}
        />

        {/* CAMERA ICON */}
        <label
          htmlFor="profileImageInput"
          className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow"
          style={{
            width: 36,
            height: 36,
            cursor: "pointer",
          }}
          title="Change profile picture"
        >
          <Camera size={18} />
        </label>
      </div>

      {/* FILE INPUT */}
      <input
        id="profileImageInput"
        type="file"
        accept="image/*"
        capture="environment"
        className="d-none"
        onChange={handleImageChange}
      />

      <small className="text-muted">Tap camera to update profile photo</small>
    </div>
  );
}
