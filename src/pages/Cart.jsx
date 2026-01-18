import { useCart } from "../context/CartContext";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {
  const { cart, updateQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  if (cart.length === 0)
    return (
      <div className="text-center py-5">
        <h4>Your cart is empty 🛒</h4>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
            >
              <div>
                <h6>{item.name}</h6>
                <p className="text-muted">₹{item.price}</p>
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
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Price Details</h5>
            <hr />
            <p>Total Amount</p>
            <h4>₹{total}</h4>

            <button
              className="btn btn-success w-100 mt-3"
              onClick={() => setShowConfirm(true)}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h5 className="fw-bold mb-3">Proceed to Checkout?</h5>
              <p>Total payable amount ₹{total}</p>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-secondary w-50"
                  onClick={() => setShowConfirm(false)}
                >
                  Continue Shopping
                </button>
                <button
                  className="btn btn-primary w-50"
                  onClick={() => navigate("/checkout")}
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
