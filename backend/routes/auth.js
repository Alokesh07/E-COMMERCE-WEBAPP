const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser);
router.put('/profile', verifyToken, authController.updateProfile);

// Address routes
router.post('/addresses', verifyToken, authController.addAddress);
router.put('/addresses/:addressId', verifyToken, authController.updateAddress);
router.delete('/addresses/:addressId', verifyToken, authController.deleteAddress);

module.exports = router;
