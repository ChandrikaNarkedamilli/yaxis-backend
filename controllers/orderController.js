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

module.exports = {
	getOrdersByUser,
};
