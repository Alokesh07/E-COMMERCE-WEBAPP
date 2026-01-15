import { useAuth } from "../../context/AuthContext";

export default function ProfileImageUploader() {
  const { user, updateUser } = useAuth();

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      updateUser({ profileImage: reader.result });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="text-center mb-3">
      <img
        src={user.profileImage || "/images/user-placeholder.png"}
        alt=""
        className="rounded-circle mb-2"
        width="100"
        height="100"
      />

      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="form-control"
        onChange={handleImage}
      />
    </div>
  );
}
