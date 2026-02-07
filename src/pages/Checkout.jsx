import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const items = state?.items || [];
  const [payment, setPayment] = useState("upi");

  const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
  const codFee = payment === "cod" ? 7 : 0;
  const total = subtotal + codFee;

  const orderId = "ORD" + Date.now();

  const handlePayment = () => {
    navigate("/order-tracking", {
      state: { orderId },
    });
  };

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">Checkout</h3>

      {/* ADDRESS */}
      <div className="card p-4 mb-4">
        <h5 className="fw-bold">Delivery Address</h5>
        {user.addresses.map((a, i) => (
          <div key={a.id} className="form-check mt-2">
            <input
              className="form-check-input"
              type="radio"
              name="address"
              defaultChecked={i === 0}
            />
            <label className="form-check-label">
              {a.address}, {a.city} - {a.zip}
            </label>
          </div>
        ))}
      </div>

      {/* PAYMENT */}
      <div className="card p-4 mb-4">
        <h5 className="fw-bold">Payment Method</h5>

        <div className="form-check">
          <input
            type="radio"
            checked={payment === "upi"}
            onChange={() => setPayment("upi")}
          />
          <label>UPI</label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            checked={payment === "card"}
            onChange={() => setPayment("card")}
          />
          <label>Credit / Debit Card</label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            checked={payment === "cod"}
            onChange={() => setPayment("cod")}
          />
          <label>Cash on Delivery (+₹7)</label>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="card p-4">
        <h5 className="fw-bold">Order Summary</h5>
        <p>Subtotal: ₹{subtotal}</p>
        {codFee > 0 && <p>COD Fee: ₹7</p>}
        <h4>Total: ₹{total}</h4>

        <button className="btn btn-success w-100 mt-3" onClick={handlePayment}>
          Pay ₹{total}
        </button>
      </div>
    </div>
  );
}
