import { useLocation, useNavigate } from "react-router-dom";
import { Check, Package, ArrowRight, ShoppingBag } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId || "N/A";

  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="success-icon">
          <Check size={48} />
        </div>
        
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with us.</p>
        
        <div className="success-order-id">
          Order ID: {orderId}
        </div>
        
        <p className="text-muted">
          We've sent a confirmation email with your order details.
        </p>
        
        <div className="success-actions">
          <button
            className="track-order-btn"
            onClick={() => navigate(`/order-tracking/${orderId}`)}
          >
            <Package size={18} style={{ marginRight: '8px' }} />
            Track Order
          </button>
          
          <button
            className="continue-shopping-btn"
            onClick={() => navigate("/")}
          >
            <ShoppingBag size={18} style={{ marginRight: '8px' }} />
            Continue Shopping
          </button>
        </div>
        
        <div className="mt-4 pt-3 border-top">
          <p className="text-muted small mb-2">Expected Delivery</p>
          <h5 className="text-primary">
            {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { 
              weekday: 'long',
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </h5>
        </div>
      </div>
    </div>
  );
}
