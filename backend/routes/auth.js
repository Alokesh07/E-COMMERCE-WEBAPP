const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser);
router.put('/profile', verifyToken, authController.updateProfile);

// Address routes
router.post('/addresses', verifyToken, authController.addAddress);
router.put('/addresses/:addressId', verifyToken, authController.updateAddress);
router.delete('/addresses/:addressId', verifyToken, authController.deleteAddress);

module.exports = router;
