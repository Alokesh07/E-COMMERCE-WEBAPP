import { Outlet, useLocation } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileDock from "./MobileDock";

export default function MainLayout() {
  const location = useLocation();

  // Hide sidebar on profile, cart, and order tracking pages
  const hideSidebar = 
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/cart") ||
    location.pathname.startsWith("/order-tracking");

  return (
    <>
      <AnnouncementBar />
      <Header />

      <div className="container-fluid">
        <div className="row">
          {!hideSidebar && <Sidebar />}

          <main className={hideSidebar ? "col-12 p-4" : "col-md-10 p-4"}>
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
      <MobileDock />
    </>
  );
}
