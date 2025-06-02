const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const checkoutController = require('../controllers/checkoutController');

router.post('/', authMiddleware, checkoutController.checkout);

module.exports = router;
