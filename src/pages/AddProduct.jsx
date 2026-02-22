import { useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { adminAPI } from "../utils/api";

export default function AddProduct({ show, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    image: "",
    description: "",
    stock: 0,
    rating: 0,
    reviews: 0
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "mobiles", "laptops", "audio", "cameras", "footwear", "mens", "womens", "accessories"
  ];

  const brands = [
    "Apple", "Samsung", "Dell", "HP", "Lenovo", "Sony", "JBL", "Boat", "Nike", "Adidas", "Puma", "OnePlus", "Realme", "Asus"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || Number(formData.price),
        discount: Number(formData.discount) || Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100),
        stock: Number(formData.stock) || 0,
        rating: Number(formData.rating) || 0,
        reviews: Number(formData.reviews) || 0
      };

      await adminAPI.createProduct(productData);
      onSuccess();
      onClose();
      setFormData({
        name: "",
        brand: "",
        category: "",
        price: "",
        originalPrice: "",
        discount: "",
        image: "",
        description: "",
        stock: 0,
        rating: 0,
        reviews: 0
      });
      setImagePreview(null);
    } catch (err) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Product</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}
              
              <div className="row">
                {/* Image Preview */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Product Image</label>
                  <div className="image-preview-container">
                    {imagePreview ? (
                      <div className="position-relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="img-fluid rounded"
                          style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x200?text=Invalid+Image';
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: "" }));
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="d-flex flex-column align-items-center justify-content-center border rounded p-4"
                        style={{ height: "200px", backgroundColor: "#f8f9fa" }}
                      >
                        <ImageIcon size={48} className="text-muted mb-2" />
                        <p className="text-muted mb-0">Enter image URL below</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      required
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Brand *</label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select Brand</option>
                        {brands.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-control"
                        required
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Original Price</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image URL *</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleImageUrlChange}
                      className="form-control"
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-control"
                      rows="3"
                      placeholder="Enter product description"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
