import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../utils/orderService";
import productsData from "../data/products.json";
import { 
  Package, ShoppingCart, 
  LogOut, Eye, Edit, Trash2, Plus, Search,
  RefreshCw
} from "lucide-react";

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function AdminDashboard() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState(productsData);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!admin) {
      navigate("/admin-login");
    }
  }, [admin, navigate]);

  // Load orders
  useEffect(() => {
    const loadedOrders = getAllOrders();
    setOrders(loadedOrders);
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    setOrders(getAllOrders());
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(orderId);
      setOrders(getAllOrders());
    }
  };

  // Stats calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status !== "DELIVERED").length;
  const deliveredOrders = orders.filter(o => o.status === "DELIVERED").length;

  // Filter products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter orders
  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          Shop<span>X</span> Admin
        </div>
        <nav className="admin-nav">
          <Link to="/" className="admin-nav-link">Home</Link>
        </nav>
        <div className="d-flex align-items-center gap-3">
          <span>Welcome, {admin?.username}</span>
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="admin-container">
        <div className="admin-stats">
          <div className="stat-card blue">
            <h3>Total Orders</h3>
            <div className="stat-value">{totalOrders}</div>
          </div>
          <div className="stat-card green">
            <h3>Revenue</h3>
            <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-card orange">
            <h3>Pending</h3>
            <div className="stat-value">{pendingOrders}</div>
          </div>
          <div className="stat-card yellow">
            <h3>Delivered</h3>
            <div className="stat-value">{deliveredOrders}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="btn-group">
            <button 
              className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab("products")}
            >
              <Package size={16} className="me-2" />
              Products
            </button>
            <button 
              className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart size={16} className="me-2" />
              Orders
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="input-group" style={{ maxWidth: "400px" }}>
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Products Table */}
        {activeTab === "products" && (
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h3>Product Management</h3>
              <button className="btn btn-primary btn-sm">
                <Plus size={16} className="me-1" /> Add Product
              </button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img src={product.image} alt={product.name} />
                        <div>
                          <div style={{ fontWeight: 500 }}>{product.name}</div>
                          <div className="text-muted" style={{ fontSize: '12px' }}>
                            {product.discount}% off
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{product.brand}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price.toLocaleString()}</td>
                    <td>
                      <span className="status-badge active">In Stock</span>
                    </td>
                    <td>
                      <button className="action-btn me-1" title="View">
                        <Eye size={14} />
                      </button>
                      <button className="action-btn me-1" title="Edit">
                        <Edit size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Table */}
        {activeTab === "orders" && (
          <div className="admin-table-container">
            <div className="admin-table-header">
              <h3>Order Management</h3>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setOrders(getAllOrders())}
              >
                <RefreshCw size={14} className="me-1" /> Refresh
              </button>
            </div>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-5">
                <Package size={48} className="text-muted mb-3" />
                <h5>No orders found</h5>
                <p className="text-muted">Orders will appear here when customers place them.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.id}</div>
                        <div className="text-muted" style={{ fontSize: '12px' }}>
                          {new Date(order.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        {order.items?.length || 0} items
                      </td>
                      <td>₹{order.total?.toLocaleString() || 0}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={order.status || "PLACED"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={{ width: '150px' }}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                              {status.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className={`status-badge ${order.paymentMethod === 'cod' ? 'inactive' : 'active'}`}>
                          {order.paymentMethod?.toUpperCase() || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn me-1" 
                          title="View Details"
                          onClick={() => navigate(`/order-tracking/${order.id}`)}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          className="action-btn" 
                          title="Delete"
                          onClick={() => handleDeleteOrder(order.id)}
                          style={{ color: '#ff6161' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
