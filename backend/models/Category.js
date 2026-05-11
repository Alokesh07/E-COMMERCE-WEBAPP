const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'select', 'multiselect', 'number', 'date', 'textarea'],
    default: 'text'
  },
  options: [String], // For select/multiselect types
  required: {
    type: Boolean,
    default: false
  },
  placeholder: String,
  helpText: String
}, { _id: true });

const subcategorySchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => 'subcat_' + Date.now()
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  specifications: [specificationSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#0d6efd'
  },
  image: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Package'
  },
  brands: [
    {
      type: String,
      trim: true
    }
  ],
  categoryImage: {
    type: String,
    default: ''
  },
  subcategories: [subcategorySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
