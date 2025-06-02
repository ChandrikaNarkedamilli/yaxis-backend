// controllers/orderController.js
const Order = require("../models/Order");

const getOrdersByUser = async (req, res) => {
	try {
		const userId = req.params.userId;
    const orders = await Order.find({ userId });
    res.status(200).json({ orders });
	} catch (error) {
		console.error("Error fetching user orders:", error);
		res.status(500).json({ error: "Server error while fetching orders." });
	}
};

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { donation = 0, platformFee = 0 } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items;
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const uniqueCategories = [...new Set(items.map((item) => item.category))];
    const discount = uniqueCategories.length >= 2 ? subtotal * 0.1 : 0;
    const total = subtotal - discount + donation + platformFee;

    const order = new Order({
      user: userId,
      items,
      subtotal,
      discount,
      donation,
      platformFee,
      total,
    });

    await order.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
	getOrdersByUser,
	placeOrder
};
