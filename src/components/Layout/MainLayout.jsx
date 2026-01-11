import { useState } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MobileDock from "./MobileDock";

export default function MainLayout({ children }) {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <>
      <AnnouncementBar />

      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <div className="container-fluid">
        <div className="row">
          <Sidebar activeCategory={activeCategory} />
          <main className="col-md-10 p-4">{children}</main>
        </div>
      </div>

      <Footer />
      <MobileDock />
    </>
  );
}
