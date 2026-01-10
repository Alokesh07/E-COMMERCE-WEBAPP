import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  User,
  ShoppingCart,
  Cpu,
  Shirt,
  Home,
  BookOpen
} from "lucide-react";

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
            className="btn btn-light rounded-circle"
            title="Profile"
            onClick={() => console.log("Open Profile")}
          >
            <User size={20} />
          </button>

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
                <h5 className="modal-title fw-bold">
                  Browse Categories
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* MODAL BODY */}
              <div className="modal-body">
                <div className="row g-4">

                  {categories.map((category, index) => {
                    const Icon = iconMap[category.icon];

                    return (
                      <div key={index} className="col-md-3">
                        <div className="border rounded p-3 h-100">

                          {/* CATEGORY HEADER */}
                          <div className="d-flex align-items-center gap-2 mb-2">
                            {Icon && <Icon size={20} />}
                            <strong>{category.name}</strong>
                          </div>

                          {/* SUBCATEGORIES */}
                          <ul className="list-unstyled small text-muted">
                            {category.subcategories.map((sub, i) => (
                              <li
                                key={i}
                                className="py-1"
                                style={{ cursor: "pointer" }}
                              >
                                {sub}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}

                </div>
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
