const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'shopx_secret_key_2024';

// Admin login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      const token = jwt.sign(
        { userId: 'admin', email: 'admin@shopx.com', role: 'admin', username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        admin: {
          username: 'admin',
          email: 'admin@shopx.com',
          role: 'admin'
        }
      });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
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

    const oldStatus = order.status;
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
