import { Outlet, useLocation } from "react-router-dom";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileDock from "./MobileDock";

export default function MainLayout() {
  const location = useLocation();

  // Hide sidebar on profile page
  const hideSidebar = location.pathname.startsWith("/profile");

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
