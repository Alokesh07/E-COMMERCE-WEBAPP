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

// Category management
router.get('/categories', adminController.getCategories);
router.get('/categories/:id', adminController.getCategoryDetail);
router.post('/categories', verifyToken, isAdmin, adminController.createCategory);
router.put('/categories/:id', verifyToken, isAdmin, adminController.updateCategory);
router.delete('/categories/:id', verifyToken, isAdmin, adminController.deleteCategory);

// Subcategory management
router.post('/categories/:id/subcategories', verifyToken, isAdmin, adminController.addSubcategory);
router.put('/categories/:id/subcategories/:subcatId', verifyToken, isAdmin, adminController.updateSubcategory);
router.delete('/categories/:id/subcategories/:subcatId', verifyToken, isAdmin, adminController.deleteSubcategory);

// Specification management
router.post('/categories/:id/subcategories/:subcatId/specifications', verifyToken, isAdmin, adminController.addSpecification);
router.delete('/categories/:id/subcategories/:subcatId/specifications/:specId', verifyToken, isAdmin, adminController.deleteSpecification);

module.exports = router;
