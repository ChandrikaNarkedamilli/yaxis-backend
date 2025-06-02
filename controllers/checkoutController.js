const Cart = require('../models/Cart');
const Order = require('../models/Order');

exports.checkout = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const items = cart.items;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = cart.discount || 0;
    const donation = req.body.donation || 0;
    const platformFee = req.body.platformFee || 0;
    const total = subtotal - discount + donation + platformFee;

    const order = new Order({
      userId,
      items,
      donation,
      platformFee,
      discount,
      total,
    });

    await order.save();

    // Clear cart
    cart.items = [];
    cart.discount = 0;
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
