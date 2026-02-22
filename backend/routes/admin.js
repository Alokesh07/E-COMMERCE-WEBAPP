const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Admin login (public)
router.post('/login', adminController.login);

// All other admin routes require authentication
router.get('/stats', verifyToken, isAdmin, adminController.getStats);
router.get('/users', verifyToken, isAdmin, adminController.getUsers);
router.get('/orders', verifyToken, isAdmin, adminController.getOrders);
router.get('/products', verifyToken, isAdmin, adminController.getProducts);

// Product management
router.post('/products', verifyToken, isAdmin, adminController.createProduct);
router.put('/products/:id', verifyToken, isAdmin, adminController.updateProduct);
router.delete('/products/:id', verifyToken, isAdmin, adminController.deleteProduct);

// Order management
router.put('/orders/:id/status', verifyToken, isAdmin, adminController.updateOrderStatus);
router.delete('/orders/:id', verifyToken, isAdmin, adminController.deleteOrder);

module.exports = router;
