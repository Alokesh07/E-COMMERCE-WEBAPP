import { useState, useEffect } from "react";
import { useFilters } from "../context/FilterContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Zap, Plus, Minus, SearchX, Star, Heart, Loader } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Shop() {
  const { filters } = useFilters();
  const { cart, addToCart, updateQty } = useCart();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getQty = (id) => cart.find((p) => p.id === id)?.qty || 0;

  const handleAdd = (product) => {
    setLoadingId(product._id || product.id);
    setTimeout(() => {
      addToCart({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brand: product.brand,
        originalPrice: product.originalPrice,
        discount: product.discount
      });
      setLoadingId(null);
    }, 700);
  };

  const filteredProducts = products
    .filter((p) => !filters.price || p.price <= filters.price)
    .filter((p) =>
      filters.brands.length ? filters.brands.includes(p.brand) : true,
    )
    .filter((p) => {
      if (!searchQuery) return true;
      return (
        p.name?.toLowerCase().includes(searchQuery) ||
        p.brand?.toLowerCase().includes(searchQuery) ||
        p.category?.toLowerCase().includes(searchQuery)
      );
    });

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Loader className="animate-spin" size={48} color="#2874f0" />
          <p className="mt-3 text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  /* NO RESULTS */
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-5">
        <SearchX size={48} className="text-muted mb-3" />
        <h4>No products found</h4>
        <p className="text-muted">
          {searchQuery ? `We couldn't find anything for "${searchQuery}"` : 'No products available yet. Admin will add products soon.'}
        </p>
        {searchQuery && (
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => navigate("/shop")}
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="row g-4">
      {filteredProducts.map((product) => {
        const qty = getQty(product._id || product.id);

        return (
          <div className="col-md-3" key={product._id || product.id}>
            <div className="product-card">
              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="product-badge">
                  {product.discount}% OFF
                </div>
              )}
              
              {/* Wishlist Button */}
              <button className="wishlist-btn" title="Add to Wishlist">
                <Heart size={16} />
              </button>

              {/* Product Image */}
              <div className="product-image-container">
                <img 
                  src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'} 
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-brand">{product.brand}</div>
                <div className="product-name" title={product.name}>
                  {product.name}
                </div>
                
                {/* Rating */}
                <div className="product-rating">
                  <span className="rating-badge">
                    <Star size={10} fill="white" />
                    {product.rating || '0'}
                  </span>
                  <span className="rating-count">({product.reviews?.toLocaleString() || '0'} reviews)</span>
                </div>

                {/* Pricing */}
                <div className="product-pricing">
                  <span className="current-price">₹{product.price?.toLocaleString() || '0'}</span>
                  {product.originalPrice && (
                    <>
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                      <span className="discount-percent">{product.discount}% off</span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="product-actions">
                  {qty === 0 ? (
                    <>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAdd(product)}
                        disabled={loadingId === (product._id || product.id)}
                      >
                        {loadingId === (product._id || product.id) ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <ShoppingCart size={14} /> Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        className="buy-now-btn"
                        onClick={() =>
                          navigate("/checkout", {
                            state: {
                              items: [{ ...product, qty: 1 }],
                              fromCart: false,
                            },
                          })
                        }
                      >
                        <Zap size={14} /> Buy
                      </button>
                    </>
                  ) : (
                    <div className="qty-selector w-100">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(product._id || product.id, qty - 1)}
                      >
                        <Minus size={14} />
                      </button>

                      <span className="qty-value">{qty}</span>

                      <button
                        className="qty-btn"
                        onClick={() => updateQty(product._id || product.id, qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
