import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { adminAPI, ordersAPI } from "../utils/api";
import CategoryManagement from "../components/Admin/CategoryManagement";
import {
  Package, ShoppingCart, LogOut, Plus, Search, Edit, Trash2,
  Eye, BarChart3, TrendingUp, Settings
} from "lucide-react";

const ORDER_STATUS = {
  PLACED: { label: "Placed", color: "#ff9f00" },
  CONFIRMED: { label: "Confirmed", color: "#2196f3" },
  PACKED: { label: "Packed", color: "#9c27b0" },
  SHIPPED: { label: "Shipped", color: "#4caf50" },
  OUT_FOR_DELIVERY: { label: "Out for Delivery", color: "#ff5722" },
  DELIVERED: { label: "Delivered", color: "#4caf50" },
  CANCELLED: { label: "Cancelled", color: "#f44336" }
};

export default function AdminDashboard() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    brand: "",
    price: 0,
    stock: {},
    image: null,
    sizes: [],
    specifications: {}
  });

  // Redirect if not admin
  useEffect(() => {
    if (!admin) {
      navigate("/admin-login");
    }
  }, [admin, navigate]);

  // Load data
  useEffect(() => {
    loadDashboardData();
    loadCategories();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        ordersAPI.getMyOrders()
      ]);
      setStats(statsRes.stats || statsRes);
      setOrders(statsRes.recentOrders || ordersRes.orders || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await adminAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      const updated = orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o);
      setOrders(updated);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Delete this order permanently?")) {
      try {
        await ordersAPI.cancel(orderId, "Admin deletion");
        setOrders(orders.filter(o => o._id !== orderId));
      } catch (err) {
        console.error("Error deleting order:", err);
      }
    }
  };

  const calculateAnalytics = () => {
    if (!stats) return {};
    const totalRevenue = stats.totalRevenue || 0;
    return {
      totalRevenue,
      totalOrders: stats.totalOrders || 0,
      avgOrderValue: stats.totalOrders ? (totalRevenue / stats.totalOrders).toFixed(2) : 0,
      pendingOrders: stats.pendingOrders || 0,
      deliveredOrders: stats.deliveredOrders || 0,
      totalProducts: stats.totalProducts || 0,
      totalUsers: stats.totalUsers || 0
    };
  };

  const getSelectedSubcategory = () => {
    if (!newProduct.category || !newProduct.subcategory) return null;
    const cat = categories.find(c => c._id === newProduct.category);
    return cat?.subcategories.find(s => s._id === newProduct.subcategory);
  };

  const analytics = calculateAnalytics();
  const filteredOrders = orders.filter(o =>
    o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
        <div style={{ fontSize: "24px", fontWeight: "800" }}>
          Shop<span style={{ color: "#ffd700" }}>X</span> Admin
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "14px" }}>Welcome, {admin?.username}</span>
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px"
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar Tabs */}
      <div style={{ display: "flex" }}>
        <div style={{
          width: "200px",
          background: "#fff",
          borderRight: "1px solid #e0e0e0",
          padding: "20px 0"
        }}>
          {["overview", "orders", "products", "categories", "analytics"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "none",
                background: activeTab === tab ? "#f0f0f0" : "transparent",
                borderLeft: activeTab === tab ? "4px solid #667eea" : "4px solid transparent",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: activeTab === tab ? "600" : "500",
                color: activeTab === tab ? "#667eea" : "#666",
                transition: "all 0.3s"
              }}
            >
              {tab === "overview" && <BarChart3 size={16} style={{ marginRight: "8px", display: "inline" }} />}
              {tab === "orders" && <ShoppingCart size={16} style={{ marginRight: "8px", display: "inline" }} />}
              {tab === "products" && <Package size={16} style={{ marginRight: "8px", display: "inline" }} />}
              {tab === "categories" && <Settings size={16} style={{ marginRight: "8px", display: "inline" }} />}
              {tab === "analytics" && <TrendingUp size={16} style={{ marginRight: "8px", display: "inline" }} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: "30px 40px" }}>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <h2 style={{ marginBottom: "30px", color: "#333" }}>Dashboard Overview</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
              }}>
                {[
                  { label: "Total Revenue", value: `₹${analytics.totalRevenue?.toLocaleString()}`, color: "#667eea" },
                  { label: "Total Orders", value: analytics.totalOrders || 0, color: "#764ba2" },
                  { label: "Delivered", value: analytics.deliveredOrders || 0, color: "#4caf50" },
                  { label: "Pending", value: analytics.pendingOrders || 0, color: "#ff9f00" },
                  { label: "Total Products", value: analytics.totalProducts || 0, color: "#2196f3" },
                  { label: "Total Users", value: analytics.totalUsers || 0, color: "#ff5722" }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    borderLeft: `4px solid ${stat.color}`
                  }}>
                    <div style={{ color: "#999", fontSize: "12px", marginBottom: "8px" }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: "700", color: stat.color }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", marginTop: "20px" }}>
                <h4 style={{ marginBottom: "16px" }}>Recent Orders</h4>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                        <th style={{ textAlign: "left", padding: "12px", fontSize: "13px", fontWeight: "600" }}>Order ID</th>
                        <th style={{ textAlign: "left", padding: "12px", fontSize: "13px", fontWeight: "600" }}>Customer</th>
                        <th style={{ textAlign: "left", padding: "12px", fontSize: "13px", fontWeight: "600" }}>Amount</th>
                        <th style={{ textAlign: "left", padding: "12px", fontSize: "13px", fontWeight: "600" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                          <td style={{ padding: "12px", fontSize: "13px" }}>{order._id}</td>
                          <td style={{ padding: "12px", fontSize: "13px" }}>{order.userId?.name}</td>
                          <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600" }}>₹{order.total?.toLocaleString()}</td>
                          <td style={{ padding: "12px", fontSize: "13px" }}>
                            <span style={{
                              background: ORDER_STATUS[order.status]?.color || "#ccc",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: "600"
                            }}>
                              {ORDER_STATUS[order.status]?.label || order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "#333" }}>Order Management</h2>
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    width: "300px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{
                background: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                overflowX: "auto"
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f5f5f5", borderBottom: "2px solid #e0e0e0" }}>
                      <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "600" }}>Order ID</th>
                      <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "600" }}>Customer</th>
                      <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "600" }}>Date</th>
                      <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "600" }}>Amount</th>
                      <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "600" }}>Status</th>
                      <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "600" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order._id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                        <td style={{ padding: "16px", fontSize: "13px", fontWeight: "600" }}>{order._id}</td>
                        <td style={{ padding: "16px", fontSize: "13px" }}>{order.userId?.name}</td>
                        <td style={{ padding: "16px", fontSize: "13px" }}>
                          {new Date(order.orderedAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "16px", fontSize: "13px", fontWeight: "600" }}>
                          ₹{order.total?.toLocaleString()}
                        </td>
                        <td style={{ padding: "16px", fontSize: "13px" }}>
                          <select
                            value={order.status || "PLACED"}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={order.status === "CANCELLED"}
                            style={{
                              padding: "6px 8px",
                              border: `1px solid ${ORDER_STATUS[order.status]?.color || "#ccc"}`,
                              borderRadius: "4px",
                              fontSize: "12px",
                              background: "#fff",
                              cursor: order.status === "CANCELLED" ? "not-allowed" : "pointer",
                              opacity: order.status === "CANCELLED" ? 0.6 : 1
                            }}
                          >
                            {Object.entries(ORDER_STATUS).map(([key, val]) => (
                              <option key={key} value={key}>{val.label}</option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: "16px", fontSize: "13px" }}>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            style={{
                              background: "#ff5252",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB - WITH DYNAMIC SPECS */}
          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "#333" }}>Product Management</h2>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  style={{
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px"
                  }}
                >
                  <Plus size={16} />
                  Add Product
                </button>
              </div>

              {showAddProduct && (
                <div style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                  <h3 style={{ marginBottom: "16px", color: "#333" }}>Add New Product</h3>
                  
                  {/* Basic Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <input
                      placeholder="Product Name *"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}
                    />
                    <input
                      placeholder="Brand"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                      style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}
                    />

                    {/* Category Select */}
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ 
                        ...newProduct, 
                        category: e.target.value,
                        subcategory: "",
                        specifications: {}
                      })}
                      style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}
                    >
                      <option value="">Select Category *</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>

                    {/* Subcategory Select (Dynamic) */}
                    {newProduct.category && (
                      <select
                        value={newProduct.subcategory}
                        onChange={(e) => setNewProduct({ 
                          ...newProduct, 
                          subcategory: e.target.value,
                          specifications: {}
                        })}
                        style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}
                      >
                        <option value="">Select Subcategory *</option>
                        {categories.find(c => c._id === newProduct.category)?.subcategories?.map(subcat => (
                          <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
                        ))}
                      </select>
                    )}

                    <input
                      type="number"
                      placeholder="Price (₹) *"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                      style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}
                    />
                  </div>

                  {/* Description */}
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "14px",
                      width: "100%",
                      marginBottom: "16px",
                      minHeight: "100px",
                      resize: "vertical"
                    }}
                  />

                  {/* Dynamic Specifications */}
                  {getSelectedSubcategory() && (
                    <div style={{
                      background: "#f9f9f9",
                      padding: "16px",
                      borderRadius: "8px",
                      marginBottom: "16px",
                      border: "2px solid #e0e0e0"
                    }}>
                      <h4 style={{ marginBottom: "16px", color: "#333" }}>
                        📋 Product Specifications for <strong>{getSelectedSubcategory().name}</strong>
                      </h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        {getSelectedSubcategory().specifications?.map(spec => (
                          <div key={spec._id}>
                            <label style={{ display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: "600" }}>
                              {spec.name}
                              {spec.required && <span style={{ color: "red" }}>*</span>}
                            </label>
                            {spec.type === "select" ? (
                              <select
                                value={newProduct.specifications[spec.name] || ""}
                                onChange={(e) => setNewProduct({
                                  ...newProduct,
                                  specifications: {
                                    ...newProduct.specifications,
                                    [spec.name]: e.target.value
                                  }
                                })}
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  borderRadius: "4px",
                                  width: "100%",
                                  fontSize: "13px"
                                }}
                              >
                                <option value="">{spec.placeholder || "Select..."}</option>
                                {spec.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : spec.type === "textarea" ? (
                              <textarea
                                placeholder={spec.placeholder}
                                value={newProduct.specifications[spec.name] || ""}
                                onChange={(e) => setNewProduct({
                                  ...newProduct,
                                  specifications: {
                                    ...newProduct.specifications,
                                    [spec.name]: e.target.value
                                  }
                                })}
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  borderRadius: "4px",
                                  width: "100%",
                                  fontSize: "13px",
                                  minHeight: "60px",
                                  resize: "vertical"
                                }}
                              />
                            ) : (
                              <input
                                type={spec.type}
                                placeholder={spec.placeholder}
                                value={newProduct.specifications[spec.name] || ""}
                                onChange={(e) => setNewProduct({
                                  ...newProduct,
                                  specifications: {
                                    ...newProduct.specifications,
                                    [spec.name]: e.target.value
                                  }
                                })}
                                style={{
                                  padding: "8px",
                                  border: "1px solid #ddd",
                                  borderRadius: "4px",
                                  width: "100%",
                                  fontSize: "13px"
                                }}
                              />
                            )}
                            {spec.helpText && (
                              <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#999" }}>
                                {spec.helpText}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Upload */}
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600" }}>
                      Product Image
                    </label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewProduct({ ...newProduct, image: event.target.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ padding: "8px" }}
                      />
                      {newProduct.image && (
                        <img
                          src={newProduct.image}
                          alt="preview"
                          style={{ width: "80px", height: "80px", borderRadius: "6px", objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={async () => {
                        if (!newProduct.name || !newProduct.price || !newProduct.subcategory) {
                          alert("Please fill all required fields (Name, Price, Subcategory)");
                          return;
                        }
                        try {
                          await adminAPI.createProduct(newProduct);
                          setNewProduct({
                            name: "",
                            description: "",
                            category: "",
                            subcategory: "",
                            brand: "",
                            price: 0,
                            stock: {},
                            image: null,
                            sizes: [],
                            specifications: {}
                          });
                          setShowAddProduct(false);
                          loadDashboardData();
                          alert("Product added successfully!");
                        } catch (err) {
                          console.error("Error adding product:", err);
                          alert("Failed to add product: " + err.message);
                        }
                      }}
                      style={{
                        background: "#4caf50",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                      }}
                    >
                      ✓ Add Product
                    </button>
                    <button
                      onClick={() => setShowAddProduct(false)}
                      style={{
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <p style={{ color: "#999", fontSize: "14px" }}>📝 Products list coming soon...</p>
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === "categories" && (
            <CategoryManagement />
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div>
              <h2 style={{ marginBottom: "30px", color: "#333" }}>Analytics & Revenue Breakdown</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px"
              }}>
                {[
                  { label: "Total Revenue", value: `₹${analytics.totalRevenue?.toLocaleString()}`, icon: "💰" },
                  { label: "Total Orders", value: analytics.totalOrders, icon: "📦" },
                  { label: "Avg Order Value", value: `₹${analytics.avgOrderValue}`, icon: "📊" },
                  { label: "Delivered Orders", value: analytics.deliveredOrders, icon: "✅" }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                  }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{stat.icon}</div>
                    <div style={{ color: "#999", fontSize: "12px", marginBottom: "8px" }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: "#667eea" }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <h4 style={{ marginBottom: "16px" }}>Revenue by Status</h4>
                <div style={{ display: "grid", gap: "12px" }}>
                  {[
                    { status: "Delivered", value: analytics.deliveredOrders * 5000, color: "#4caf50" },
                    { status: "Pending", value: analytics.pendingOrders * 2500, color: "#ff9f00" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "150px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                          {item.status}
                        </div>
                        <div style={{
                          height: "8px",
                          background: "#f0f0f0",
                          borderRadius: "4px",
                          overflow: "hidden"
                        }}>
                          <div style={{
                            height: "100%",
                            width: `${Math.min(100, (item.value / (analytics.totalRevenue || 1)) * 100)}%`,
                            background: item.color
                          }} />
                        </div>
                      </div>
                      <div style={{ fontWeight: "600", color: item.color }}>
                        ₹{item.value?.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
