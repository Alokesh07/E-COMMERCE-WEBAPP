const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/seed', categoryController.seedCategories);
router.get('/:slug', categoryController.getCategory);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, categoryController.getAllCategoriesAdmin);
router.post('/', verifyToken, isAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

// Subcategory routes
router.post('/:id/subcategories', verifyToken, isAdmin, categoryController.addSubcategory);
router.delete('/:id/subcategories/:subcategoryId', verifyToken, isAdmin, categoryController.removeSubcategory);

module.exports = router;
