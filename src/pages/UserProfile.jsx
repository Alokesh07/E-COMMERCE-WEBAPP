import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileInfoPanel from "../components/Profile/ProfileInfoPanel";
import AddressPanel from "../components/Profile/AddressPanel";
import OrderHistoryPanel from "../components/Profile/OrderHistoryPanel";
import LogoutConfirmModal from "../components/Profile/LogoutConfirmModal";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showLogout, setShowLogout] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) setActiveTab(tab);
  }, [location.search]);

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* SIDEBAR */}
        <div className="col-md-3">
          <ProfileSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogoutClick={() => setShowLogout(true)}
          />
        </div>

        {/* CONTENT */}
        <div className="col-md-9 profile-content">
          {activeTab === "profile" && <ProfileInfoPanel />}
          {activeTab === "addresses" && <AddressPanel />}
          {activeTab === "orders" && <OrderHistoryPanel />}
        </div>
      </div>

      <LogoutConfirmModal
        show={showLogout}
        onClose={() => setShowLogout(false)}
      />
    </div>
  );
}
