import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState(null);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showNewSubcategory, setShowNewSubcategory] = useState(null);
  const [showNewSpec, setShowNewSpec] = useState(null);

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'Package',
    color: '#0d6efd'
  });

  const [newSubcategory, setNewSubcategory] = useState({
    name: '',
    description: ''
  });

  const [newSpec, setNewSpec] = useState({
    name: '',
    type: 'text',
    options: [],
    required: false,
    placeholder: ''
  });

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      alert('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    try {
      await adminAPI.createCategory(newCategory);
      setNewCategory({ name: '', description: '', icon: 'Package', color: '#0d6efd' });
      setShowNewCategory(false);
      loadCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category and all subcategories?')) {
      try {
        await adminAPI.deleteCategory(id);
        loadCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Failed to delete category');
      }
    }
  };

  const handleAddSubcategory = async (categoryId) => {
    if (!newSubcategory.name.trim()) {
      alert('Subcategory name is required');
      return;
    }
    try {
      await adminAPI.addSubcategory(categoryId, newSubcategory);
      setNewSubcategory({ name: '', description: '' });
      setShowNewSubcategory(null);
      loadCategories();
    } catch (err) {
      console.error('Error adding subcategory:', err);
      alert('Failed to add subcategory: ' + err.message);
    }
  };

  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    if (window.confirm('Delete this subcategory?')) {
      try {
        await adminAPI.deleteSubcategory(categoryId, subcategoryId);
        loadCategories();
      } catch (err) {
        console.error('Error deleting subcategory:', err);
        alert('Failed to delete subcategory');
      }
    }
  };

  const handleAddSpecification = async (categoryId, subcategoryId) => {
    if (!newSpec.name.trim()) {
      alert('Specification name is required');
      return;
    }
    try {
      await adminAPI.addSpecification(categoryId, subcategoryId, newSpec);
      setNewSpec({ name: '', type: 'text', options: [], required: false, placeholder: '' });
      setShowNewSpec(null);
      loadCategories();
    } catch (err) {
      console.error('Error adding specification:', err);
      alert('Failed to add specification: ' + err.message);
    }
  };

  const handleDeleteSpec = async (categoryId, subcategoryId, specId) => {
    if (window.confirm('Delete this specification?')) {
      try {
        await adminAPI.deleteSpecification(categoryId, subcategoryId, specId);
        loadCategories();
      } catch (err) {
        console.error('Error deleting specification:', err);
        alert('Failed to delete specification');
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading categories...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Category Management</h2>
        <button
          onClick={() => setShowNewCategory(!showNewCategory)}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      {/* New Category Form */}
      {showNewCategory && (
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            />
            <input
              placeholder="Icon (e.g., Zap, Home)"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>
          <textarea
            placeholder="Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              width: '100%',
              marginBottom: '16px',
              minHeight: '80px'
            }}
          />
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCreateCategory}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Create Category
            </button>
            <button
              onClick={() => setShowNewCategory(false)}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {categories.map(category => (
          <div
            key={category._id}
            style={{
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}
          >
            {/* Category Header */}
            <div
              style={{
                padding: '16px',
                background: category.color || '#0d6efd',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setExpandedCategory(expandedCategory === category._id ? null : category._id)}
            >
              <div>
                <h4 style={{ margin: '0 0 4px 0' }}>{category.name}</h4>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>{category.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category._id);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                </button>
                {expandedCategory === category._id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedCategory === category._id && (
              <div style={{ padding: '16px', background: '#f9f9f9' }}>
                {/* Add Subcategory Button */}
                <button
                  onClick={() => setShowNewSubcategory(showNewSubcategory === category._id ? null : category._id)}
                  style={{
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} />
                  Add Subcategory
                </button>

                {/* New Subcategory Form */}
                {showNewSubcategory === category._id && (
                  <div style={{
                    background: '#fff',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    border: '1px solid #ddd'
                  }}>
                    <input
                      placeholder="Subcategory Name"
                      value={newSubcategory.name}
                      onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                      style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', marginBottom: '8px' }}
                    />
                    <textarea
                      placeholder="Description"
                      value={newSubcategory.description}
                      onChange={(e) => setNewSubcategory({ ...newSubcategory, description: e.target.value })}
                      style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '100%',
                        marginBottom: '8px',
                        minHeight: '60px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleAddSubcategory(category._id)}
                        style={{
                          background: '#4caf50',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setShowNewSubcategory(null)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Subcategories */}
                <div style={{ display: 'grid', gap: '12px' }}>
                  {category.subcategories?.map(subcat => (
                    <div
                      key={subcat._id}
                      style={{
                        background: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Subcategory Header */}
                      <div
                        style={{
                          padding: '12px',
                          background: '#f0f0f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => setExpandedSubcategory(
                          expandedSubcategory === subcat._id ? null : subcat._id
                        )}
                      >
                        <div>
                          <h5 style={{ margin: '0 0 2px 0' }}>{subcat.name}</h5>
                          <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>
                            {subcat.specifications?.length || 0} specifications
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSubcategory(category._id, subcat._id);
                            }}
                            style={{
                              background: '#ff5252',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                          {expandedSubcategory === subcat._id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </div>

                      {/* Specifications */}
                      {expandedSubcategory === subcat._id && (
                        <div style={{ padding: '12px', borderTop: '1px solid #e0e0e0' }}>
                          <button
                            onClick={() => setShowNewSpec(showNewSpec === subcat._id ? null : subcat._id)}
                            style={{
                              background: '#2196f3',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginBottom: '12px',
                              fontSize: '12px'
                            }}
                          >
                            <Plus size={12} style={{ marginRight: '4px', display: 'inline' }} />
                            Add Specification
                          </button>

                          {/* New Spec Form */}
                          {showNewSpec === subcat._id && (
                            <div style={{
                              background: '#f5f5f5',
                              padding: '12px',
                              borderRadius: '4px',
                              marginBottom: '12px'
                            }}>
                              <input
                                placeholder="Spec Name"
                                value={newSpec.name}
                                onChange={(e) => setNewSpec({ ...newSpec, name: e.target.value })}
                                style={{ padding: '6px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', marginBottom: '8px', fontSize: '12px' }}
                              />
                              <select
                                value={newSpec.type}
                                onChange={(e) => setNewSpec({ ...newSpec, type: e.target.value })}
                                style={{ padding: '6px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', marginBottom: '8px', fontSize: '12px' }}
                              >
                                <option value="text">Text</option>
                                <option value="select">Select</option>
                                <option value="multiselect">Multi-Select</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                              </select>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px' }}>
                                <input
                                  type="checkbox"
                                  checked={newSpec.required}
                                  onChange={(e) => setNewSpec({ ...newSpec, required: e.target.checked })}
                                />
                                Required Field
                              </label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  onClick={() => handleAddSpecification(category._id, subcat._id)}
                                  style={{
                                    background: '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                >
                                  Add Spec
                                </button>
                                <button
                                  onClick={() => setShowNewSpec(null)}
                                  style={{
                                    background: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '11px'
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Specs List */}
                          {subcat.specifications?.length > 0 ? (
                            <div style={{ display: 'grid', gap: '8px' }}>
                              {subcat.specifications.map((spec, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    background: '#fff',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    border: '1px solid #e0e0e0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '12px'
                                  }}
                                >
                                  <div>
                                    <strong>{spec.name}</strong>
                                    <span style={{ marginLeft: '8px', color: '#999' }}>
                                      ({spec.type}{spec.required ? ', Required' : ''})
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteSpec(category._id, subcat._id, spec._id)}
                                    style={{
                                      background: '#ff5252',
                                      color: 'white',
                                      border: 'none',
                                      padding: '3px 6px',
                                      borderRadius: '3px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>No specifications yet</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
