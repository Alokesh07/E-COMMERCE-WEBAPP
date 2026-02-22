import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, User, ShoppingCart, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useAdmin } from "../../context/AdminContext";
import LogoutConfirmModal from "../Profile/LogoutConfirmModal";

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
  const { admin } = useAdmin();
  
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);

  // Fetch categories and products from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('http://localhost:5000/api/categories');
        const categoriesData = await categoriesRes.json();
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }
        
        // Fetch products
        const productsRes = await fetch('http://localhost:5000/api/products');
        const productsData = await productsRes.json();
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
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
          {/* ADMIN LOGIN BUTTON - Show when not logged in as admin */}
          {!admin && (
            <Link to="/admin-login" className="btn btn-outline-primary d-flex align-items-center gap-2">
              <Shield size={18} />
              <span className="d-none d-md-inline">Admin</span>
            </Link>
          )}

          {/* USER PROFILE */}
          <button
            className="btn btn-light d-flex align-items-center gap-2"
            onClick={() => navigate(user ? "/profile" : "/auth")}
          >
            <User size={20} />
            {user && <span className="small fw-semibold">{user.name}</span>}
            {admin && <span className="small fw-semibold text-primary">Admin</span>}
          </button>

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
                      <div className="col-md-3" key={cat._id || cat.id}>
                        <div
                          className="card h-100 text-center category-card"
                          style={{ cursor: "pointer" }}
                          onClick={() => setActiveCategory(cat)}
                        >
                          <img
                            src={cat.image || 'https://via.placeholder.com/200x200?text=Category'}
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
                      {activeCategory.subcategories?.map((sub) => (
                        <div className="col-md-3" key={sub._id || sub.id}>
                          <div className="card h-100 text-center subcategory-card">
                            <img
                              src={sub.image || 'https://via.placeholder.com/200x200?text=Subcategory'}
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
