import { useEffect, useState } from "react";
import { Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../utils/orderService";

export default function OrderHistoryPanel() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const allOrders = getAllOrders();
    setOrders(allOrders);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="card p-4 shadow-sm text-center">
        <h4 className="fw-bold mb-3">Your Orders</h4>

        <img 
          src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-5521508-4610092.png" 
          alt="No orders" 
          width="200" 
          className="mb-3"
          onError={(e) => {
            e.target.src = 'https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d0a2452c-275a-4f2c-8d2e-1d6c7d9a2d7b.png';
          }}
        />

        <p className="text-muted">You haven't placed any orders yet.</p>
        <small className="text-muted">Once you shop, they'll appear here.</small>
        
        <div className="mt-3">
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="fw-bold mb-4">Your Orders</h4>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item-card mb-3 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="mb-1">Order #{order.id}</h6>
                <small className="text-muted">
                  {new Date(order.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </small>
              </div>
              <div className="text-end">
                <h6 className="mb-1">₹{order.total?.toLocaleString()}</h6>
                <span className={`badge ${order.status === 'DELIVERED' ? 'bg-success' : 'bg-warning'}`}>
                  {order.status?.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate(`/order-tracking/${order.id}`)}
              >
                <Package size={14} className="me-1" />
                Track Order
                <ArrowRight size={14} className="ms-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
