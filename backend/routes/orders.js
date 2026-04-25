const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Admin routes (declare early to avoid param collisions)
router.get('/admin/all', verifyToken, isAdmin, orderController.getAllOrders);
router.get('/admin/stats', verifyToken, isAdmin, orderController.getOrderStats);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);

// User routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/track/:orderId', verifyToken, orderController.getOrderByOrderId);
router.post('/:id/cancel', verifyToken, orderController.cancelOrder);
router.get('/:id', verifyToken, orderController.getOrder);

module.exports = router;
