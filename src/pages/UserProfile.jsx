import ProfileInfo from "../components/Profile/ProfileInfo";
import AddressManager from "../components/Profile/AddressManager";
import OrderHistory from "../components/Profile/OrderHistory";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container my-4">
      <h3 className="mb-4 fw-bold">My Account</h3>

      <div className="row g-4">
        {/* CHAMBER 1 */}
        <div className="col-md-4">
          <ProfileInfo />
        </div>

        {/* CHAMBER 2 */}
        <div className="col-md-4">
          <AddressManager />
        </div>

        {/* CHAMBER 3 */}
        <div className="col-md-4">
          <OrderHistory />

          <button
            className="btn btn-danger w-100 mt-3"
            onClick={() => {
              logout();
              navigate("/auth");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
