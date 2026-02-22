const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// User routes
router.post('/', verifyToken, orderController.createOrder);
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrder);
router.get('/track/:orderId', verifyToken, orderController.getOrderByOrderId);
router.post('/:id/cancel', verifyToken, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);
router.get('/admin/stats', verifyToken, isAdmin, orderController.getOrderStats);

module.exports = router;
