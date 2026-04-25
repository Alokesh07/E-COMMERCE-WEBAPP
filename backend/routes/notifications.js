const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Admin routes (declare before param routes)
router.get('/admin/all', verifyToken, isAdmin, notificationController.getAllNotifications);

// User routes
router.get('/', verifyToken, notificationController.getUserNotifications);
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);
router.put('/read-all', verifyToken, notificationController.markAllAsRead);
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;
