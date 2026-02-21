import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../utils/orderService";
import { Check, Package, Truck, Home, RotateCcw, ArrowLeft } from "lucide-react";

const STATUS_FLOW = [
  { key: "PLACED", label: "Order Placed", icon: Check, desc: "Your order has been placed successfully" },
  { key: "CONFIRMED", label: "Order Confirmed", icon: RotateCcw, desc: "Seller has confirmed your order" },
  { key: "PACKED", label: "Packed", icon: Package, desc: "Your order is being packed" },
  { key: "SHIPPED", label: "Shipped", icon: Truck, desc: "Your order has been shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck, desc: "Your order is out for delivery" },
  { key: "DELIVERED", label: "Delivered", icon: Home, desc: "Your order has been delivered" },
];

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const order = getOrderById(orderId);
  
  const currentStatusIndex = STATUS_FLOW.findIndex(s => s.key === (order?.status || "PLACED"));

  return (
    <div className="tracking-page">
      <div className="container">
        <button className="btn btn-link text-decoration-none mb-3" onClick={() => navigate("/profile")}>
          <ArrowLeft size={16} /> Back to Profile
        </button>
        
        <div className="tracking-container">
          {/* Header */}
          <div className="tracking-header">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="tracking-order-id">Order ID: {orderId}</div>
                <div className="tracking-order-date">
                  Ordered on {new Date().toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              <div className="tracking-status-badge">
                {order?.status?.replace('_', ' ') || 'Processing'}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="tracking-timeline">
            <h4 className="mb-4">Track Your Order</h4>
            
            <div className="timeline">
              {STATUS_FLOW.map((status, index) => {
                const isCompleted = index < currentStatusIndex;
                const isActive = index === currentStatusIndex;
                const Icon = status.icon;
                
                return (
                  <div 
                    key={status.key} 
                    className={`timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="timeline-dot">
                      {isCompleted ? <Check size={12} /> : isActive ? <Icon size={12} /> : null}
                    </div>
                    <div className="timeline-content">
                      <h4>{status.label}</h4>
                      <p>{status.desc}</p>
                      {isActive && (
                        <div className="timeline-date">
                          Expected delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Card */}
          {order && (
            <div className="card mt-4">
              <div className="card-body">
                <h5>Order Details</h5>
                <div className="row mt-3">
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Payment Method:</strong> {order.paymentMethod?.toUpperCase() || 'N/A'}</p>
                    <p className="mb-0"><strong>Total Amount:</strong> ₹{order.total?.toLocaleString() || 0}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1"><strong>Delivery Address:</strong></p>
                    <p className="text-muted mb-0">
                      {order.address?.address}, {order.address?.city} - {order.address?.zip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
