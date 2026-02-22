const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// User routes
router.get('/', verifyToken, notificationController.getUserNotifications);
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.put('/read-all', verifyToken, notificationController.markAllAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, notificationController.getAllNotifications);

module.exports = router;
