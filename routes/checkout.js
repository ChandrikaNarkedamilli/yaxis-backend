const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, donation = 0 } = req.body;
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

  const categories = new Set(cart.items.map((item) => item.category));
  const isBundleDiscount = categories.size >= 2;
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = isBundleDiscount ? subtotal * 0.1 : 0;
  const platformFee = 20;
  const total = subtotal - discount + donation + platformFee;

  cart.items = [];
  cart.discount = discount;
  await cart.save();

  res.json({ message: 'Order placed', total });
});

module.exports = router;