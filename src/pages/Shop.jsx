import products from "../data/products.json";
import { useFilters } from "../context/FilterContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Zap, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const { filters } = useFilters();
  const { cart, addToCart, updateQty } = useCart();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);

  const filteredProducts = products
    .filter((p) => p.price <= filters.price)
    .filter((p) =>
      filters.brands.length ? filters.brands.includes(p.brand) : true
    );

  const getQty = (id) => cart.find((p) => p.id === id)?.qty || 0;

  const handleAdd = (product) => {
    setLoadingId(product.id);
    setTimeout(() => {
      addToCart(product);
      setLoadingId(null);
    }, 700);
  };

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
                    <>
                      <button
                        className="btn btn-primary w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleAdd(product)}
                        disabled={loadingId === product.id}
                      >
                        {loadingId === product.id ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <ShoppingCart size={16} /> Add to Cart
                          </>
                        )}
                      </button>

                      <button
                        className="btn btn-warning w-100 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => navigate("/checkout")}
                      >
                        <Zap size={16} /> Buy Now
                      </button>
                    </>
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
