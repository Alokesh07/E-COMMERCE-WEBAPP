const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'shopx_secret_key_2024';

// Admin login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const query = { role: 'admin', $or: [{ username }, { email: String(username).toLowerCase() }] };
    const user = await User.findOne(query);

    if (!user) {
      console.log(`[Admin Auth] No admin found for '${username}'`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[Admin Auth] Password mismatch for '${username}'`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role, username: user.username || user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log(`✓ Admin login successful for '${username}'`);
    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[Admin Auth Error]', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get admin dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $in: ['PLACED', 'CONFIRMED'] } });
    const shippedOrders = await Order.countDocuments({ status: { $in: ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY'] } });
    const deliveredOrders = await Order.countDocuments({ status: 'DELIVERED' });
    const cancelledOrders = await Order.countDocuments({ status: 'CANCELLED' });
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ orderedAt: -1 })
      .limit(5);

    // Recent notifications
    const recentNotifications = await Notification.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalProducts,
        totalUsers,
        totalRevenue
      },
      recentOrders,
      recentNotifications
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get all orders (admin view)
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ orderedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get all products (admin view)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    // Announce new product to users (non-blocking)
    try {
      const emailService = require('../utils/emailService');
      emailService.sendProductAnnouncementToAll(product);
    } catch (e) {
      console.error('Product announcement error', e);
    }

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    // Set timestamps based on status
    switch (status) {
      case 'CONFIRMED':
        order.confirmedAt = new Date();
        break;
      case 'PACKED':
        order.packedAt = new Date();
        break;
      case 'SHIPPED':
        order.shippedAt = new Date();
        break;
      case 'OUT_FOR_DELIVERY':
        break;
      case 'DELIVERED':
        order.deliveredAt = new Date();
        break;
      case 'CANCELLED':
        order.cancelledAt = new Date();
        order.cancelledBy = 'admin';
        break;
    }

    await order.save();

    // Create notification for user
    const notificationTypes = {
      'CONFIRMED': { type: 'order_confirmed', title: 'Order Confirmed', message: `Your order ${order.orderId} has been confirmed!` },
      'PACKED': { type: 'order_packed', title: 'Order Packed', message: `Your order ${order.orderId} has been packed.` },
      'SHIPPED': { type: 'order_shipped', title: 'Order Shipped', message: `Your order ${order.orderId} has been shipped!` },
      'DELIVERED': { type: 'order_delivered', title: 'Order Delivered', message: `Your order ${order.orderId} has been delivered.` },
      'CANCELLED': { type: 'order_cancelled', title: 'Order Cancelled', message: `Your order ${order.orderId} has been cancelled.` }
    };

    if (notificationTypes[status]) {
      const notification = new Notification({
        userId: order.userId,
        ...notificationTypes[status],
        orderId: order.orderId
      });
      await notification.save();

      // Emit notification
      const io = req.app.get('io');
      io.to(`user-${order.userId}`).emit('new-notification', notification);
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};

// ==================== CATEGORY MANAGEMENT ====================

// Get all categories with subcategories and specifications
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get single category with all details
exports.getCategoryDetail = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon, image, color } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      slug,
      description: description || '',
      icon: icon || 'Package',
      image: image || '',
      color: color || '#0d6efd',
      subcategories: [],
      isActive: true
    });

    await category.save();
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, icon, image, color } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name && name !== category.name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const existing = await Category.findOne({ slug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'Category name already exists' });
      }
      category.name = name;
      category.slug = slug;
    }

    category.description = description || category.description;
    category.icon = icon || category.icon;
    category.image = image || category.image;
    category.color = color || category.color;
    category.updatedAt = new Date();

    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category
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

// ==================== SUBCATEGORY MANAGEMENT ====================

// Add subcategory to category
exports.addSubcategory = async (req, res) => {
  try {
    const { name, description, icon, image, specifications } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const existingSubcat = category.subcategories.find(s => s.slug === slug);
    if (existingSubcat) {
      return res.status(400).json({ message: 'Subcategory already exists in this category' });
    }

    const subcategory = {
      id: 'subcat_' + Date.now(),
      name,
      slug,
      description: description || '',
      image: image || '',
      specifications: specifications || [],
      isActive: true,
      order: category.subcategories.length
    };

    category.subcategories.push(subcategory);
    await category.save();

    res.status(201).json({ message: 'Subcategory added successfully', subcategory });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subcategory', error: error.message });
  }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { name, description, icon, image, specifications } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subcatId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    if (name && name !== subcategory.name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const existing = category.subcategories.find(s => s.slug === slug && s._id.toString() !== req.params.subcatId);
      if (existing) {
        return res.status(400).json({ message: 'Subcategory name already exists' });
      }
      subcategory.name = name;
      subcategory.slug = slug;
    }

    subcategory.description = description !== undefined ? description : subcategory.description;
    subcategory.image = image || subcategory.image;
    subcategory.specifications = specifications || subcategory.specifications;

    await category.save();
    res.json({ message: 'Subcategory updated successfully', subcategory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subcategory', error: error.message });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.subcategories.id(req.params.subcatId).remove();
    await category.save();

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory', error: error.message });
  }
};

// Add specification to subcategory
exports.addSpecification = async (req, res) => {
  try {
    const { name, type, options, required, placeholder, helpText } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subcatId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    if (!name) {
      return res.status(400).json({ message: 'Specification name is required' });
    }

    const specification = {
      name,
      type: type || 'text',
      options: options || [],
      required: required || false,
      placeholder: placeholder || '',
      helpText: helpText || ''
    };

    subcategory.specifications.push(specification);
    await category.save();

    res.status(201).json({ message: 'Specification added successfully', specification });
  } catch (error) {
    res.status(500).json({ message: 'Error adding specification', error: error.message });
  }
};

// Delete specification
exports.deleteSpecification = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const subcategory = category.subcategories.id(req.params.subcatId);
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subcategory.specifications.id(req.params.specId).remove();
    await category.save();

    res.json({ message: 'Specification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting specification', error: error.message });
  }
};
