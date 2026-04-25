const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getAllCategories);
// Admin/seed routes (declare before slug param)
router.post('/seed', verifyToken, isAdmin, categoryController.seedCategories);
router.get('/admin/all', verifyToken, isAdmin, categoryController.getAllCategoriesAdmin);
router.post('/', verifyToken, isAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

// Public param route (slug)
router.get('/:slug', categoryController.getCategory);

// Subcategory routes
router.post('/:id/subcategories', verifyToken, isAdmin, categoryController.addSubcategory);
router.delete('/:id/subcategories/:subcategoryId', verifyToken, isAdmin, categoryController.removeSubcategory);

module.exports = router;
