const Category = require('../models/Category');

// Helper to create slug from name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all categories (public)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get single category with subcategories
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Create category (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, color, image, icon, subcategories, order } = req.body;
    
    // Create slug
    let slug = createSlug(name);
    
    // Check if slug exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      slug = `${slug}-${Date.now()}`;
    }

    // Process subcategories
    let processedSubcategories = [];
    if (subcategories && subcategories.length > 0) {
      processedSubcategories = subcategories.map(sub => ({
        name: sub.name,
        slug: createSlug(sub.name),
        image: sub.image || '',
        isActive: true
      }));
    }

    const category = new Category({
      name,
      slug,
      description,
      color: color || '#0d6efd',
      image: image || '',
      icon: icon || 'Package',
      subcategories: processedSubcategories,
      order: order || 0,
      isActive: true
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update category (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, color, image, icon, subcategories, order, isActive } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update fields
    if (name) {
      category.name = name;
      category.slug = createSlug(name);
    }
    if (description !== undefined) category.description = description;
    if (color) category.color = color;
    if (image !== undefined) category.image = image;
    if (icon) category.icon = icon;
    if (order !== undefined) category.order = order;
    if (isActive !== undefined) category.isActive = isActive;

    // Process subcategories if provided
    if (subcategories && Array.isArray(subcategories)) {
      category.subcategories = subcategories.map(sub => ({
        name: sub.name,
        slug: createSlug(sub.name),
        image: sub.image || '',
        isActive: sub.isActive !== false,
        _id: sub._id // Preserve existing IDs for updates
      }));
    }

    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

// Add subcategory to existing category (Admin)
exports.addSubcategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if subcategory already exists
    const existingSub = category.subcategories.find(
      sub => sub.name.toLowerCase() === name.toLowerCase()
    );
    if (existingSub) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }

    category.subcategories.push({
      name,
      slug: createSlug(name),
      image: image || '',
      isActive: true
    });

    await category.save();
    res.json({ message: 'Subcategory added successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subcategory', error: error.message });
  }
};

// Remove subcategory (Admin)
exports.removeSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.subcategories = category.subcategories.filter(
      sub => sub._id.toString() !== req.params.subcategoryId
    );

    await category.save();
    res.json({ message: 'Subcategory removed successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error removing subcategory', error: error.message });
  }
};

// Get all categories for admin (including inactive)
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Seed default categories
exports.seedCategories = async (req, res) => {
  try {
    const defaultCategories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronics and gadgets',
        color: '#0d6efd',
        image: '/images/categories/electronics.jpg',
        icon: 'Cpu',
        order: 1,
        subcategories: [
          { name: 'Mobiles', slug: 'mobiles', image: '/images/subcategories/mobiles.jpg' },
          { name: 'Laptops', slug: 'laptops', image: '/images/subcategories/laptops.jpg' },
          { name: 'Audio Devices', slug: 'audio', image: '/images/subcategories/audio.jpg' },
          { name: 'Cameras', slug: 'cameras', image: '/images/subcategories/cameras.jpg' }
        ]
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trending fashion items',
        color: '#d63384',
        image: '/images/categories/fashion.jpg',
        icon: 'Shirt',
        order: 2,
        subcategories: [
          { name: "Men's Clothing", slug: 'mens', image: '/images/subcategories/mens.jpg' },
          { name: "Women's Clothing", slug: 'womens', image: '/images/subcategories/womens.jpg' },
          { name: 'Footwear', slug: 'footwear', image: '/images/subcategories/footwear.jpg' },
          { name: 'Accessories', slug: 'accessories', image: '/images/subcategories/accessories.jpg' }
        ]
      }
    ];

    // Clear existing and insert new
    await Category.deleteMany({});
    await Category.insertMany(defaultCategories);
    
    res.json({ message: 'Categories seeded successfully', count: defaultCategories.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding categories', error: error.message });
  }
};
