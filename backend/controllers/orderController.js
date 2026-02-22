const Order = require('../models/Order');
const Notification = require('../models/Notification');
const Product = require('../models/Product');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, total, subtotal, deliveryFee, discount, paymentMethod, address, upiTransactionId } = req.body;
    
    const order = new Order({
      userId: req.user.userId,
      items,
      total,
      subtotal,
      deliveryFee,
      discount,
      paymentMethod,
      address,
      upiTransactionId: upiTransactionId || '',
      paymentStatus: 'paid',
      status: 'PLACED'
    });

    await order.save();

    // Create notification for user
    const notification = new Notification({
      userId: req.user.userId,
      type: 'order_placed',
      title: 'Order Placed',
      message: `Your order ${order.orderId} has been placed successfully!`,
      orderId: order.orderId
    });
    await notification.save();

    // Emit notification via socket
    const io = req.app.get('io');
    io.to(`user-${req.user.userId}`).emit('new-notification', notification);

    // Notify admin
    io.to('admin-room').emit('new-order', {
      orderId: order.orderId,
      total: order.total,
      items: order.items.length
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ orderedAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id,
      userId: req.user.userId 
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Get order by orderId
exports.getOrderByOrderId = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('userId', 'name email phone');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ 
      _id: req.params.id,
      userId: req.user.userId 
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel shipped or delivered orders' });
    }

    order.status = 'CANCELLED';
    order.cancelledAt = new Date();
    order.cancelledBy = 'user';
    order.cancellationReason = reason || 'Cancelled by customer';
    await order.save();

    // Create notification
    const notification = new Notification({
      userId: req.user.userId,
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: `Your order ${order.orderId} has been cancelled.`,
      orderId: order.orderId
    });
    await notification.save();

    // Emit notification
    const io = req.app.get('io');
    io.to(`user-${req.user.userId}`).emit('order-cancelled', { orderId: order.orderId });

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
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

// Update order status (Admin)
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
      'PACKED': { type: 'order_packed', title: 'Order Packed', message: `Your order ${order.orderId} has been packed and will be shipped soon.` },
      'SHIPPED': { type: 'order_shipped', title: 'Order Shipped', message: `Your order ${order.orderId} has been shipped!` },
      'DELIVERED': { type: 'order_delivered', title: 'Order Delivered', message: `Your order ${order.orderId} has been delivered. Thank you for shopping with us!` },
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
      io.to(`user-${order.userId}`).emit('order-status-update', { orderId: order.orderId, status });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Get order statistics (Admin)
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: { $in: ['PLACED', 'CONFIRMED'] } });
    const shippedOrders = await Order.countDocuments({ status: { $in: ['PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY']} });
    const deliveredOrders = await Order.countDocuments({ status: 'DELIVERED' });
    const cancelledOrders = await Order.countDocuments({ status: 'CANCELLED' });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order stats', error: error.message });
  }
};
