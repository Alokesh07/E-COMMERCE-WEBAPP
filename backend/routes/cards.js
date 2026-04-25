const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const { verifyToken } = require('../middleware/auth');

// All card routes require authentication
router.get('/', verifyToken, cardController.getUserCards);
router.post('/', verifyToken, cardController.addCard);
router.put('/:id/default', verifyToken, cardController.setDefaultCard);
router.put('/:id', verifyToken, cardController.updateCard);
router.delete('/:id', verifyToken, cardController.deleteCard);

module.exports = router;
