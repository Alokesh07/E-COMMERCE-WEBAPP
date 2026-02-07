import products from "../data/products.json";
import { useFilters } from "../context/FilterContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Zap, Plus, Minus, SearchX } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Shop() {
  const { filters } = useFilters();
  const { cart, addToCart, updateQty } = useCart();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const getQty = (id) => cart.find((p) => p.id === id)?.qty || 0;

  const handleAdd = (product) => {
    setLoadingId(product.id);
    setTimeout(() => {
      addToCart(product);
      setLoadingId(null);
    }, 700);
  };

  const filteredProducts = products
    .filter((p) => p.price <= filters.price)
    .filter((p) =>
      filters.brands.length ? filters.brands.includes(p.brand) : true,
    )
    .filter((p) => {
      if (!searchQuery) return true;
      return (
        p.name.toLowerCase().includes(searchQuery) ||
        p.brand?.toLowerCase().includes(searchQuery) ||
        p.category?.toLowerCase().includes(searchQuery)
      );
    });

  /* NO RESULTS */
  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-5">
        <SearchX size={48} className="text-muted mb-3" />
        <h4>No results found</h4>
        <p className="text-muted">
          We couldn’t find anything for <strong>“{searchQuery}”</strong>
        </p>
        <button
          className="btn btn-outline-primary mt-3"
          onClick={() => navigate("/shop")}
        >
          Clear Search
        </button>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {filteredProducts.map((product) => {
        const qty = getQty(product.id);

        return (
          <div className="col-md-3" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold">{product.name}</h6>
                <p className="text-muted mb-2">₹{product.price}</p>

                <div className="mt-auto">
                  {qty === 0 ? (
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-1 rounded-pill px-3 shadow-sm"
                        onClick={() => handleAdd(product)}
                        disabled={loadingId === product.id}
                      >
                        {loadingId === product.id ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <ShoppingCart size={14} /> Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill px-3"
                        onClick={() =>
                          navigate("/checkout", {
                            state: {
                              items: [{ ...product, qty: 1 }],
                              fromCart: false,
                            },
                          })
                        }
                      >
                        <Zap size={14} /> Buy Now
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center border rounded px-3 py-2">
                      <button
                        className="btn btn-light"
                        onClick={() => updateQty(product.id, qty - 1)}
                      >
                        <Minus size={14} />
                      </button>

                      <strong>{qty}</strong>

                      <button
                        className="btn btn-light"
                        onClick={() => updateQty(product.id, qty + 1)}
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
