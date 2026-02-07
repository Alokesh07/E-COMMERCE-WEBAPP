import { useCart } from "../context/CartContext";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const { cart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const subtotal = cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  const deliveryFee = cart.length ? 40 : 0;
  const discount = cart.length ? 100 : 0;
  const total = subtotal + deliveryFee - discount;

  /* EMPTY CART */
  if (cart.length === 0) {
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center">
        <img
          src="/images/empty-cart.png"
          alt="Empty Cart"
          style={{ maxWidth: 280 }}
        />
        <h4 className="mt-4">Your cart feels lonely 😢</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container py-5">
        <h3 className="fw-bold mb-4">My Cart</h3>

        <div className="row">
          {/* ITEMS */}
          <div className="col-md-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
              >
                <div>
                  <h6 className="fw-semibold">{item.name}</h6>
                  <small className="text-muted">₹{item.price}</small>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-light"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                  >
                    <Minus size={14} />
                  </button>

                  <strong>{item.qty}</strong>

                  <button
                    className="btn btn-light"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                  >
                    <Plus size={14} />
                  </button>

                  <button
                    className="btn btn-outline-danger"
                    onClick={() => updateQty(item.id, 0)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => navigate("/")}
            >
              Shop More
            </button>
          </div>

          {/* SUMMARY */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4">
              <h5 className="fw-bold">Price Details</h5>
              <hr />

              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="d-flex justify-content-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className="d-flex justify-content-between text-success">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="btn btn-success w-100 mt-3"
                onClick={() => setShowConfirm(true)}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM */}
      {showConfirm && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="fw-bold mb-3">Proceed to Checkout?</h5>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary w-50"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary w-50"
                  onClick={() => {
                    clearCart();
                    navigate("/checkout", {
                      state: { items: cart, fromCart: true },
                    });
                  }}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
