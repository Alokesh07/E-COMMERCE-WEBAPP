import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  User,
  ShoppingCart,
  Cpu,
  Shirt,
  Home,
  BookOpen,
} from "lucide-react";
// import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../Auth/AuthModal";

import categories from "../../data/categories.json";

/* ICON MAP */
const iconMap = {
  Cpu,
  Shirt,
  Home,
  BookOpen,
};

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  // onClick={() => setActiveCategory(category)}

  return (
    <>
      {/* HEADER BAR */}
      <nav className="navbar bg-white shadow-sm px-4">
        {/* BRAND */}
        <Link className="navbar-brand fw-bold fs-4" to="/">
          Shop<span className="text-primary">X</span>
        </Link>

        {/* CATEGORY BUTTON */}
        <button
          className="btn btn-outline-dark d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Menu size={18} />
          Categories
        </button>

        {/* SEARCH */}
        <div className="mx-auto w-50 d-none d-lg-block">
          <input
            className="form-control rounded-pill"
            placeholder="Search products, brands, and more..."
          />
        </div>

        {/* RIGHT ICONS */}
        <div className="d-flex align-items-center gap-4">
          {/* USER */}
          <button
            className="btn btn-light d-flex align-items-center gap-2"
            onClick={() => setShowAuth(true)}
          >
            <User size={20} />
            {user && <span className="small">{user.name}</span>}
          </button>

          <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />

          {/* CART */}
          <button
            className="btn btn-light position-relative rounded-circle"
            title="Cart"
            onClick={() => console.log("Open Cart")}
          >
            <ShoppingCart size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              2
            </span>
          </button>
        </div>
      </nav>

      {/* ================= CATEGORY MODAL ================= */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              {/* MODAL HEADER */}
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Browse Categories</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* MODAL BODY */}
              <div className="modal-body">
                {!activeCategory ? (
                  <div className="row g-4">
                    {categories.map((cat) => (
                      <div className="col-md-3" key={cat.id}>
                        <div
                          className="card h-100 text-center category-card"
                          style={{ borderColor: cat.color, cursor: "pointer" }}
                          onClick={() => setActiveCategory(cat)}
                        >
                          <img src={cat.image} className="card-img-top" />
                          <div className="card-body">
                            <h6 className="fw-bold">{cat.name}</h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-outline-secondary mb-3"
                      onClick={() => setActiveCategory(null)}
                    >
                      ← Back to Categories
                    </button>

                    <div className="row g-4">
                      {activeCategory.subcategories.map((sub) => (
                        <div className="col-md-3" key={sub.id}>
                          <div className="card h-100 text-center subcategory-card">
                            <img src={sub.image} className="card-img-top" />
                            <div className="card-body">
                              <h6>{sub.name}</h6>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* MODAL FOOTER */}
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
