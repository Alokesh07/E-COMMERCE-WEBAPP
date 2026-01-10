import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import ScrollToTop from "./components/Layout/ScrollToTop";
import "./App.css";
function App() {
  return (
    <Router>
      <ScrollToTop />

      <MainLayout>
        {/* TEMP CONTENT AREA */}
        {/* <div className="text-center mt-5">
          <h1 className="fw-bold mb-3">
            Welcome to <span className="text-primary">ShopX</span>
          </h1>

          <p className="text-muted fs-5">
            Layout setup is complete.  
            Product pages, cart, and checkout coming next 🚀
          </p>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <button className="btn btn-dark btn-lg">Explore Shop</button>
            <button className="btn btn-outline-dark btn-lg">
              View Cart
            </button>
          </div>
        </div> */}
      </MainLayout>
    </Router>
  );
}

export default App;
