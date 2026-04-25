const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
// Admin routes (place before param routes to avoid collisions)
router.get('/admin/all', verifyToken, isAdmin, productController.getAllProductsAdmin);
router.post('/seed', verifyToken, isAdmin, productController.seedProducts);
router.post('/', verifyToken, isAdmin, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

// Public param route (last)
router.get('/:id', productController.getProduct);

module.exports = router;
