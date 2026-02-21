import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, ShoppingCart, Power } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LogoutConfirmModal from "../Profile/LogoutConfirmModal";
import categories from "../../data/categories.json";
import products from "../../data/products.json";

export default function Header() {
  const navigate = useNavigate();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const { cart } = useCart();
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.brand?.toLowerCase().includes(value.toLowerCase()) ||
          p.category?.toLowerCase().includes(value.toLowerCase()),
      )
      .slice(0, 5);

    setSuggestions(matches);
  };
  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setSearch("");
    setSuggestions([]);
  };

  const { user } = useAuth();

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
          onClick={() => setShowCategoryModal(true)}
        >
          <Menu size={18} />
          Categories
        </button>

        {/* SEARCH */}
        {/* <div className="mx-auto w-50 d-none d-lg-block">
          <input
            className="form-control rounded-pill"
            placeholder="Search products, brands, and more..."
          />
        </div> */}
        {/* SEARCH */}
        <div className="mx-auto w-50 d-none d-lg-block position-relative">
          <input
            className="form-control rounded-pill px-4"
            placeholder="Search products, brands, and more..."
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(search)}
            onBlur={() => setTimeout(() => setSuggestions([]), 200)}
          />

          {/* AUTOSUGGEST */}
          {suggestions.length > 0 && (
            <div className="position-absolute bg-white shadow rounded w-100 mt-1 z-3">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="px-3 py-2 suggestion-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSearchSubmit(item.name)}
                >
                  <strong>{item.name}</strong>
                  <div className="text-muted small">{item.brand}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT ICONS */}
        <div className="d-flex align-items-center gap-3">
          {/* USER PROFILE */}
          <button
            className="btn btn-light d-flex align-items-center gap-2"
            onClick={() => navigate("/profile")}
          >
            <User size={20} />
            {user && <span className="small fw-semibold">{user.name}</span>}
          </button>

          {/* LOGOUT POWER BUTTON */}
          {user && (
            <button
              className="btn btn-outline-danger"
              title="Logout"
              onClick={() => setShowLogout(true)}
            >
              <Power size={18} />
            </button>
          )}

          {/* CART */}
          <button
            className="btn btn-light position-relative rounded-circle"
            title="Cart"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart size={20} />
            {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              0
            </span> */}
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* LOGOUT CONFIRM MODAL */}
      <LogoutConfirmModal
        show={showLogout}
        onClose={() => setShowLogout(false)}
      />

      {/* ================= CATEGORY MODAL ================= */}
      {showCategoryModal && (
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
                  onClick={() => {
                    setShowCategoryModal(false);
                    setActiveCategory(null);
                  }}
                />
              </div>

              {/* MODAL BODY */}
              <div className="modal-body">
                {!activeCategory ? (
                  <div className="row g-4">
                    {categories.map((cat) => (
                      <div className="col-md-3" key={cat.id}>
                        <div
                          className="card h-100 text-center category-card"
                          style={{ cursor: "pointer" }}
                          onClick={() => setActiveCategory(cat)}
                        >
                          <img
                            src={cat.image}
                            className="card-img-top"
                            alt=""
                          />
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
                            <img
                              src={sub.image}
                              className="card-img-top"
                              alt=""
                            />
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
                  onClick={() => {
                    setShowCategoryModal(false);
                    setActiveCategory(null);
                  }}
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
