import { User, MapPin, Package, Power } from "lucide-react";

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  onLogoutClick,
}) {
  const itemClass = (tab) =>
    `list-group-item list-group-item-action d-flex align-items-center gap-2 ${
      activeTab === tab ? "active" : ""
    }`;

  return (
    <div className="card shadow-sm">
      <div className="list-group list-group-flush">
        <button
          className={itemClass("profile")}
          onClick={() => setActiveTab("profile")}
        >
          <User size={18} /> Profile Info
        </button>

        <button
          className={itemClass("addresses")}
          onClick={() => setActiveTab("addresses")}
        >
          <MapPin size={18} /> Saved Addresses
        </button>

        <button
          className={itemClass("orders")}
          onClick={() => setActiveTab("orders")}
        >
          <Package size={18} /> Orders
        </button>

        <button
          className="list-group-item list-group-item-action text-danger d-flex align-items-center gap-2"
          onClick={onLogoutClick}
        >
          <Power size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
