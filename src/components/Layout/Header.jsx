import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, ShoppingCart, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { productsAPI, categoriesAPI, authAPI } from "../../utils/api";
import LogoutConfirmModal from "../Profile/LogoutConfirmModal";
import '../../styles/header.css';

export default function Header() {
  const navigate = useNavigate();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  
  const { cart, addToCart, updateQty } = useCart();
  const { user } = useAuth();
  
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  // Fetch categories and products from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await categoriesAPI.getAll();
        if (Array.isArray(categoriesData)) setCategories(categoriesData);

        const productsData = await productsAPI.getAll({ limit: 100 });
        // productsAPI.getAll returns object { products, ... } earlier; handle both
        if (Array.isArray(productsData)) setProducts(productsData);
        else if (productsData && Array.isArray(productsData.products)) setProducts(productsData.products);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

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
          p.name?.toLowerCase().includes(value.toLowerCase()) ||
          p.brand?.toLowerCase().includes(value.toLowerCase()) ||
          p.category?.toLowerCase().includes(value.toLowerCase())
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

  const getQty = (id) => cart.find((p) => p.id === id)?.qty || 0;

  const handleAdd = (product) => {
    setLoadingId(product._id || product.id);
    setTimeout(() => {
      addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand
      });
      setLoadingId(null);
    }, 700);
  };

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
                  key={item._id || item.id}
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
          {/* Admin login removed from header — accessible via /auth page only */}

          {/* USER PROFILE */}
          <button
            className="btn btn-light d-flex align-items-center gap-2"
            onClick={() => navigate(user ? "/profile" : "/auth")}
          >
            <User size={20} />
            {user && <span className="small fw-semibold">{user.name || user.email}</span>}
            
          </button>

          {/* Logout button when user is logged in */}
          {user && (
            <button
              className="btn btn-outline-danger d-flex align-items-center gap-2"
              onClick={async () => {
                try {
                  await authAPI.logout();
                } catch (e) {}
                // dispatch global logout
                try { window.dispatchEvent(new Event('app:logout')); } catch (e) {}
                navigate('/auth');
              }}
            >
              Logout
            </button>
          )}

          {/* CART */}
          <button
            className="btn btn-light position-relative rounded-circle"
            title="Cart"
            onClick={() => navigate(user ? "/cart" : "/auth")}
          >
            <ShoppingCart size={20} />
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
      {showCategoryModal && categories.length > 0 && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              {/* MODAL HEADER */}
              <div className="modal-header" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderBottom: "none"
              }}>
                <h5 className="modal-title fw-bold" style={{ color: "white" }}>✨ Browse Categories</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setActiveCategory(null);
                  }}
                />
              </div>

              {/* MODAL BODY */}
              <div className="modal-body" style={{ background: "#f8f9fa" }}>
                {!activeCategory ? (
                  <div className="row g-4">
                    {categories.map((cat) => (
                      <div className="col-md-3" key={cat._id || cat.id}>
                        <div
                          className="card h-100"
                          style={{
                            cursor: "pointer",
                            overflow: "hidden",
                            border: "none",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            position: "relative",
                            minHeight: "220px"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-8px)";
                            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                          }}
                          onClick={() => setActiveCategory(cat)}
                        >
                          {/* Background Image */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              backgroundImage: `url('${cat.categoryImage || 'https://via.placeholder.com/200x200?text=Category'}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              opacity: 0.3,
                              zIndex: 1
                            }}
                          />
                          {/* Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              background: `linear-gradient(135deg, ${cat.color || '#667eea'}dd 0%, ${cat.color || '#667eea'}99 100%)`,
                              zIndex: 2
                            }}
                          />
                          {/* Content */}
                          <div className="card-body d-flex flex-column justify-content-center align-items-center" style={{
                            position: "relative",
                            zIndex: 3,
                            textAlign: "center",
                            height: "100%"
                          }}>
                            <h5 className="fw-bold" style={{ color: "white", margin: 0, fontSize: "18px" }}>
                              {cat.name}
                            </h5>
                            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: "8px 0 0 0" }}>
                              {cat.subcategories?.length || 0} subcategories
                            </p>
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
                      style={{ transition: "all 0.2s ease-out" }}
                    >
                      ← Back to Categories
                    </button>

                    <div className="row g-4">
                      {activeCategory.subcategories?.map((sub) => (
                        <div className="col-md-3" key={sub._id || sub.id}>
                          <div className="card h-100" style={{
                            overflow: "hidden",
                            border: "none",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            minHeight: "180px"
                          }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.05)";
                              e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                            }}
                          >
                            <img
                              src={sub.image || 'https://via.placeholder.com/200x200?text=Subcategory'}
                              className="card-img-top"
                              alt={sub.name}
                              style={{ height: "150px", objectFit: "cover", opacity: 0.8 }}
                            />
                            <div className="card-body">
                              <h6 style={{ fontWeight: "600", marginBottom: 0 }}>{sub.name}</h6>
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
