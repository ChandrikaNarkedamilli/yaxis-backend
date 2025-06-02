const Cart = require('../models/Cart');

exports.checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Simulate order processing
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Checkout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  }
};
