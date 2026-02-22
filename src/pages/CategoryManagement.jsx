import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";
import { categoriesAPI } from "../utils/api";
import { 
  Package, ShoppingCart, 
  LogOut, Eye, Edit, Trash2, Plus, Search,
  RefreshCw, ChevronRight, X
} from "lucide-react";

export default function CategoryManagement() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#0d6efd",
    image: "",
    icon: "Package",
    subcategories: []
  });
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!admin) {
      navigate("/admin-login");
    }
  }, [admin, navigate]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAllAdmin();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || "",
        color: category.color || "#0d6efd",
        image: category.image || "",
        icon: category.icon || "Package",
        subcategories: category.subcategories || []
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        color: "#0d6efd",
        image: "",
        icon: "Package",
        subcategories: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      color: "#0d6efd",
      image: "",
      icon: "Package",
      subcategories: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, formData);
      } else {
        await categoriesAPI.create(formData);
      }
      await fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setLoading(true);
        await categoriesAPI.delete(id);
        await fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddSubcategory = (category) => {
    setSelectedCategory(category);
    setSubcategoryName("");
    setSubcategoryImage("");
    setShowSubcategoryModal(true);
  };

  const handleSubmitSubcategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await categoriesAPI.addSubcategory(selectedCategory._id, {
        name: subcategoryName,
        image: subcategoryImage
      });
      await fetchCategories();
      setShowSubcategoryModal(false);
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubcategory = async (categoryId, subcategoryId) => {
    if (window.confirm("Are you sure you want to remove this subcategory?")) {
      try {
        setLoading(true);
        await categoriesAPI.removeSubcategory(categoryId, subcategoryId);
        await fetchCategories();
      } catch (error) {
        console.error("Error removing subcategory:", error);
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const seedCategories = async () => {
    try {
      setLoading(true);
      await categoriesAPI.seed();
      await fetchCategories();
      alert("Categories seeded successfully!");
    } catch (error) {
      console.error("Error seeding categories:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo">
          Shop<span>X</span> Admin
        </div>
        <div className="admin-nav">
          <Link to="/admin" className="btn btn-outline-light btn-sm">
            Products
          </Link>
          <Link to="/admin/orders" className="btn btn-outline-light btn-sm">
            Orders
          </Link>
          <Link to="/admin/categories" className="btn btn-light btn-sm">
            Categories
          </Link>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Category Management</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary" onClick={seedCategories}>
              <RefreshCw size={16} className="me-1" />
              Seed Categories
            </button>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={16} className="me-1" />
              Add Category
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {categories.map((category) => (
              <div key={category._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div 
                    className="card-header d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: category.color || '#0d6efd', color: 'white' }}
                  >
                    <h5 className="mb-0">{category.name}</h5>
                    <div>
                      <button 
                        className="btn btn-sm btn-light me-1" 
                        onClick={() => handleOpenModal(category)}
                      >
                        <Edit size={14} />
                      </button>
                      <button 
                        className="btn btn-sm btn-light" 
                        onClick={() => handleDelete(category._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="text-muted small">
                      {category.description || "No description"}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">
                        {category.subcategories?.length || 0} Subcategories
                      </span>
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleAddSubcategory(category)}
                      >
                        <Plus size={14} className="me-1" />
                        Add
                      </button>
                    </div>
                    
                    {/* Subcategories List */}
                    {category.subcategories && category.subcategories.length > 0 && (
                      <div className="subcategory-list mt-3">
                        {category.subcategories.map((sub) => (
                          <div 
                            key={sub._id} 
                            className="d-flex justify-content-between align-items-center p-2 mb-1 bg-light rounded"
                          >
                            <span>{sub.name}</span>
                            <button 
                              className="btn btn-sm text-danger"
                              onClick={() => handleRemoveSubcategory(category._id, sub._id)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h5>
                <button className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Color</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.image && (
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="mt-2" 
                        style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Icon</label>
                    <select
                      className="form-select"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    >
                      <option value="Package">Package</option>
                      <option value="Cpu">Cpu</option>
                      <option value="Shirt">Shirt</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Headphones">Headphones</option>
                      <option value="Camera">Camera</option>
                      <option value="Watch">Watch</option>
                      <option value="Shoe">Shoe</option>
                      <option value="ShoppingBag">ShoppingBag</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Subcategory to {selectedCategory?.name}</h5>
                <button className="btn-close" onClick={() => setShowSubcategoryModal(false)}></button>
              </div>
              <form onSubmit={handleSubmitSubcategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Subcategory Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={subcategoryName}
                      onChange={(e) => setSubcategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={subcategoryImage}
                      onChange={(e) => setSubcategoryImage(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {subcategoryImage && (
                      <img 
                        src={subcategoryImage} 
                        alt="Preview" 
                        className="mt-2" 
                        style={{ maxWidth: "150px", maxHeight: "100px", objectFit: "cover" }}
                      />
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSubcategoryModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Subcategory"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
