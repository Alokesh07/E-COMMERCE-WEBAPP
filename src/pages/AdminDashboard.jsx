import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { getAllOrders, updateOrderStatus, deleteOrder } from "../utils/orderService";
import productsData from "../data/products.json";
import { 
  Package, ShoppingCart, 
  LogOut, Eye, Edit, Trash2, Plus, Search,
  RefreshCw, Grid, List
} from "lucide-react";

const STATUS_OPTIONS = ["PLACED", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

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
        <div className="admin-nav">
          <button 
            className={`btn btn-sm ${activeTab === 'products' ? 'btn-light' : 'btn-outline-light'}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={16} className="me-1" />
            Products
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'orders' ? 'btn-light' : 'btn-outline-light'}`}
            onClick={() => setActiveTab("orders")}
          >
            <ShoppingCart size={16} className="me-1" />
            Orders
          </button>
          <Link to="/admin/add-product" className="btn btn-outline-light btn-sm">
            <Plus size={16} className="me-1" />
            Add Product
          </Link>
          <Link to="/admin/categories" className="btn btn-outline-light btn-sm">
            <Grid size={16} className="me-1" />
            Categories
          </Link>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="admin-content">
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stat-card">
              <h3>₹{totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h3>{totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h3>{pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card">
              <h3>{deliveredOrders}</h3>
              <p>Delivered Orders</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="input-group" style={{ maxWidth: "400px" }}>
            <span className="input-group-text">
              <Search size={18} />
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

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Products ({filteredProducts.length})</h4>
              <Link to="/admin/add-product" className="btn btn-primary btn-sm">
                <Plus size={16} className="me-1" />
                Add Product
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover">
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
                        <div className="d-flex align-items-center gap-2">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            className="rounded"
                          />
                          <div>
                            <div style={{ fontWeight: 500 }}>{product.name}</div>
                            <div className="text-muted" style={{ fontSize: '12px' }}>
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price?.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn me-1" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button className="action-btn" title="Delete" style={{ color: '#ff6161' }}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h4 className="mb-3">Orders ({filteredOrders.length})</h4>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-5">
                <ShoppingCart size={48} className="text-muted mb-3" />
                <p className="text-muted">No orders found</p>
              </div>
            ) : (
              <table className="table table-hover">
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
