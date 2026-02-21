import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { MapPin, CreditCard, Wallet, Banknote, Check, Navigation, CreditCardIcon } from "lucide-react";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const items = state?.items || [];
  const [payment, setPayment] = useState("upi");
  const [selectedAddress, setSelectedAddress] = useState(0);

  // Ensure user has addresses array
  const userAddresses = user?.addresses || [];
  const hasAddresses = userAddresses.length > 0;

  const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const codFee = payment === "cod" ? 30 : 0;
  const discount = subtotal > 1000 ? 100 : 0;
  const total = subtotal + deliveryFee + codFee - discount;

  const orderId = "ORD" + Date.now();

  const handlePayment = () => {
    if (!hasAddresses) return;
    
    // Save order to localStorage with userId
    const newOrder = {
      id: orderId,
      userId: user?.id,
      items: items,
      total: total,
      status: "PLACED",
      date: new Date().toISOString(),
      address: userAddresses[selectedAddress],
      paymentMethod: payment,
    };
    
    // Use orderService to save
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    navigate("/order-success", { state: { orderId } });
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-container">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Address Section */}
            <div className="checkout-section">
              <div className="section-header">
                <div className="section-icon">
                  <MapPin size={20} />
                </div>
                <h3 className="section-title">Delivery Address</h3>
              </div>

              {hasAddresses ? (
                userAddresses.map((a, i) => (
                  <div
                    key={a.id}
                    className={`address-card ${selectedAddress === i ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(i)}
                  >
                    <div className="d-flex justify-content-between">
                      <div className="address-name">{user.name}</div>
                      {selectedAddress === i && (
                        <span className="text-primary"><Check size={16} /></span>
                      )}
                    </div>
                    <div className="address-text">
                      {a.address}, {a.city}, {a.state} - {a.zip}
                    </div>
                    <div className="address-phone">Phone: {user.phone || 'Not provided'}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <MapPin size={48} className="text-muted mb-2" />
                  <p className="text-muted">No addresses found. Please add an address in your profile.</p>
                  <button className="btn btn-primary" onClick={() => navigate("/profile")}>
                    Add Address
                  </button>
                </div>
              )}
            </div>

            {/* Payment Section */}
            <div className="checkout-section">
              <div className="section-header">
                <div className="section-icon">
                  <CreditCard size={20} />
                </div>
                <h3 className="section-title">Payment Method</h3>
              </div>

              <div className={`payment-option ${payment === 'upi' ? 'selected' : ''}`}
                onClick={() => setPayment("upi")}>
                <input type="radio" checked={payment === "upi"} readOnly />
                <div>
                  <div className="payment-label">UPI</div>
                  <div className="payment-info">Pay using Google Pay, PhonePe, Paytm</div>
                </div>
              </div>

              <div className={`payment-option ${payment === 'card' ? 'selected' : ''}`}
                onClick={() => setPayment("card")}>
                <input type="radio" checked={payment === "card"} readOnly />
                <div>
                  <div className="payment-label">Credit / Debit Card</div>
                  <div className="payment-info">Visa, Mastercard, RuPay</div>
                </div>
              </div>

              <div className={`payment-option ${payment === 'net' ? 'selected' : ''}`}
                onClick={() => setPayment("net")}>
                <input type="radio" checked={payment === "net"} readOnly />
                <div>
                  <div className="payment-label">Net Banking</div>
                  <div className="payment-info">All major banks supported</div>
                </div>
              </div>

              <div className={`payment-option ${payment === 'cod' ? 'selected' : ''}`}
                onClick={() => setPayment("cod")}>
                <input type="radio" checked={payment === "cod"} readOnly />
                <div>
                  <div className="payment-label">Cash on Delivery</div>
                  <div className="payment-info">Pay when you receive (+₹30)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            {items.map((item, index) => (
              <div key={index} className="order-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="order-item-img"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                  }}
                />
                <div className="order-item-info" style={{ flex: 1 }}>
                  <h4>{item.name}</h4>
                  <div className="order-item-qty">Qty: {item.qty}</div>
                </div>
                <div className="order-item-price">₹{(item.price * item.qty).toLocaleString()}</div>
              </div>
            ))}

            <hr />

            <div className="price-row">
              <span>Price ({items.length} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            
            <div className="price-row">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? "text-success" : ""}>
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            
            {codFee > 0 && (
              <div className="price-row">
                <span>COD Fee</span>
                <span>₹{codFee}</span>
              </div>
            )}
            
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
              className="checkout-btn w-100 mt-3" 
              onClick={handlePayment}
              disabled={!hasAddresses}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
