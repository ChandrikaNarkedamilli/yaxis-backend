const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/:itemId', authMiddleware, cartController.removeItem);
router.post('/update', authMiddleware, cartController.updateCart);
router.post('/checkout', authMiddleware, cartController.checkout);

module.exports = router;
