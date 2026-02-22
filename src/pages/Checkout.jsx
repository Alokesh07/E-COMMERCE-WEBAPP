import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { MapPin, CreditCard, Wallet, Banknote, Check, QrCode } from "lucide-react";
import UPIPayment from "../components/Payment/UPIPayment";
import CardManagement from "../components/Profile/CardManagement";
import { ordersAPI, cardsAPI } from "../utils/api";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const items = state?.items || [];
  const [payment, setPayment] = useState("upi");
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [showUPI, setShowUPI] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  const userAddresses = user?.addresses || [];
  const hasAddresses = userAddresses.length > 0;

  const subtotal = items.reduce((s, p) => s + p.price * p.qty, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const codFee = payment === "cod" ? 30 : 0;
  const discount = subtotal > 1000 ? 100 : 0;
  const total = subtotal + deliveryFee + codFee - discount;

  const orderId = "ORD" + Date.now();

  useEffect(() => {
    if (payment === "card") {
      fetchSavedCards();
    }
  }, [payment]);

  const fetchSavedCards = async () => {
    try {
      const cards = await cardsAPI.getAll();
      setSavedCards(cards);
      if (cards.length > 0) {
        const defaultCard = cards.find(c => c.isDefault) || cards[0];
        setSelectedCard(defaultCard._id);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const handlePayment = async () => {
    if (!hasAddresses) return;
    
    setLoading(true);
    
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          brand: item.brand,
          image: item.image,
          price: item.price,
          qty: item.qty
        })),
        total: total,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        paymentMethod: payment,
        address: userAddresses[selectedAddress],
        upiTransactionId: "",
        cardLast4: selectedCard ? savedCards.find(c => c._id === selectedCard)?.cardLast4 : ""
      };

      const result = await ordersAPI.create(orderData);
      navigate("/order-success", { state: { orderId: result.order.orderId } });
    } catch (error) {
      console.error("Error creating order:", error);
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
      
      const orders = JSON.parse(localStorage.getItem("orders")) || [];
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      
      navigate("/order-success", { state: { orderId } });
    } finally {
      setLoading(false);
    }
  };

  const handleUPISuccess = async (paymentData) => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          brand: item.brand,
          image: item.image,
          price: item.price,
          qty: item.qty
        })),
        total: total,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        paymentMethod: "upi",
        address: userAddresses[selectedAddress],
        upiTransactionId: paymentData.transactionId
      };

      const result = await ordersAPI.create(orderData);
      navigate("/order-success", { state: { orderId: result.order.orderId } });
    } catch (error) {
      console.error("Error creating order:", error);
      navigate("/order-success", { state: { orderId } });
    }
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-container">
          <div className="checkout-main">
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

            <div className="checkout-section">
              <div className="section-header">
                <div className="section-icon">
                  <CreditCard size={20} />
                </div>
                <h3 className="section-title">Payment Method</h3>
              </div>

              <div className={`payment-option ${payment === 'upi' ? 'selected' : ''}`}
                onClick={() => { setPayment("upi"); setShowUPI(false); }}>
                <input type="radio" checked={payment === "upi"} readOnly />
                <div className="d-flex align-items-center gap-2">
                  <QrCode size={20} />
                  <div>
                    <div className="payment-label">UPI QR Code</div>
                    <div className="payment-info">Scan QR to pay via any UPI app</div>
                  </div>
                </div>
              </div>

              <div className={`payment-option ${payment === 'card' ? 'selected' : ''}`}
                onClick={() => { setPayment("card"); setShowCardForm(false); }}>
                <input type="radio" checked={payment === "card"} readOnly />
                <div className="d-flex align-items-center gap-2">
                  <CreditCard size={20} />
                  <div>
                    <div className="payment-label">Credit / Debit Card</div>
                    <div className="payment-info">Visa, Mastercard, RuPay</div>
                  </div>
                </div>
              </div>

              <div className={`payment-option ${payment === 'net' ? 'selected' : ''}`}
                onClick={() => { setPayment("net"); setShowUPI(false); }}>
                <input type="radio" checked={payment === "net"} readOnly />
                <div className="d-flex align-items-center gap-2">
                  <Banknote size={20} />
                  <div>
                    <div className="payment-label">Net Banking</div>
                    <div className="payment-info">All major banks supported</div>
                  </div>
                </div>
              </div>

              <div className={`payment-option ${payment === 'cod' ? 'selected' : ''}`}
                onClick={() => { setPayment("cod"); setShowUPI(false); }}>
                <input type="radio" checked={payment === "cod"} readOnly />
                <div className="d-flex align-items-center gap-2">
                  <Wallet size={20} />
                  <div>
                    <div className="payment-label">Cash on Delivery</div>
                    <div className="payment-info">Pay when you receive (+₹30)</div>
                  </div>
                </div>
              </div>

              {payment === "upi" && (
                <div className="mt-3 p-3 border rounded">
                  <button 
                    className="btn btn-link p-0 mb-2" 
                    onClick={() => setShowUPI(!showUPI)}
                  >
                    {showUPI ? "Hide QR Code" : "Show QR Code"}
                  </button>
                  {showUPI && (
                    <UPIPayment 
                      amount={total} 
                      onSuccess={handleUPISuccess}
                      onCancel={() => setShowUPI(false)}
                    />
                  )}
                </div>
              )}

              {payment === "card" && (
                <div className="mt-3">
                  {savedCards.length > 0 ? (
                    <div className="mb-3">
                      <label className="form-label">Select Saved Card</label>
                      {savedCards.map(card => (
                        <div 
                          key={card._id}
                          className={`card p-2 mb-2 ${selectedCard === card._id ? 'border-primary' : ''}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedCard(card._id)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <small>•••• {card.cardLast4}</small>
                              <small className="text-muted ms-2">{card.expiryMonth}/{card.expiryYear}</small>
                            </div>
                            {card.isDefault && <span className="badge bg-primary">Default</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <CreditCard size={32} className="text-muted mb-2" />
                      <p className="text-muted small">No saved cards</p>
                    </div>
                  )}
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowCardForm(!showCardForm)}
                  >
                    {showCardForm ? "Cancel" : "Add New Card"}
                  </button>
                  
                  {showCardForm && (
                    <div className="mt-3">
                      <CardManagement />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

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
              disabled={!hasAddresses || loading || (payment === "upi" && showUPI)}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
