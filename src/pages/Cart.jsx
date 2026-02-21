import { useCart } from "../context/CartContext";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const { cart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const deliveryFee = cart.length ? 49 : 0;
  const discount = subtotal > 500 ? 50 : 0;
  const total = subtotal + deliveryFee - discount;

  /* EMPTY CART */
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img
          src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d0a2452c-275a-4f2c-8d2e-1d6c7d9a2d7b.png"
          alt="Empty Cart"
          onError={(e) => {
            e.target.src = 'https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-5521508-4610092.png';
          }}
        />
        <h3>Your cart is empty!</h3>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="shop-now-btn" onClick={() => navigate("/")}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-container">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <h2>My Cart ({cart.length} items)</h2>
              <button className="btn btn-sm btn-outline-danger" onClick={() => setShowConfirm(true)}>
                Clear Cart
              </button>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120x120?text=No+Image';
                  }}
                />

                <div className="cart-item-details">
                  <div className="cart-item-brand">{item.brand}</div>
                  <div className="cart-item-name">{item.name}</div>
                  
                  <div className="cart-item-price">
                    <span className="cart-item-current-price">₹{item.price.toLocaleString()}</span>
                    {item.originalPrice && (
                      <>
                        <span className="cart-item-original-price">₹{item.originalPrice.toLocaleString()}</span>
                        <span className="cart-item-discount">{item.discount}% off</span>
                      </>
                    )}
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-selector">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => updateQty(item.id, 0)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-3 text-end">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/")}
              >
                <ArrowRight size={16} /> Continue Shopping
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h3>Price Details</h3>
            
            <div className="price-row">
              <span>Price ({cart.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="price-row">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            
            {discount > 0 && (
              <div className="price-row discount-row">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            
            <div className="price-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                navigate("/checkout", {
                  state: { items: cart, fromCart: true },
                });
                clearCart();
              }}
            >
              Place Order <ShoppingBag size={18} />
            </button>
            
            <p className="text-muted text-center mt-3 small">
              Safe and Secure Payments. 100% Authentic Products.
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Clear Cart */}
      {showConfirm && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="fw-bold mb-3">Clear Cart?</h5>
              <p className="text-muted">Are you sure you want to remove all items from your cart?</p>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary w-50"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger w-50"
                  onClick={() => {
                    clearCart();
                    setShowConfirm(false);
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
