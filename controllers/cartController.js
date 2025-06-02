const Cart = require('../models/Cart');
const Order = require('../models/Order');

const addToCart = async (req, res) => {
  const userId = req.userId;
  const { name, price, category, description } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ message: "Missing required fields (name, price, category)" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // create a new cart if not exists
      cart = new Cart({
        userId,
        items: [{ name, price, category, description, quantity: 1 }],
      });
    } else {
      // check if item already in cart
      const existingItem = cart.items.find(item => item.name === name && item.category === category);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ name, price, category, description, quantity: 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(200).json({ items: [] });

    res.status(200).json(cart);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCart = async (req, res) => {
  const userId = req.userId;
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Items should be an array" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      cart.items = items;
    }

    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    console.error("Cart update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const checkout = async (req, res) => {
  const userId = req.userId;
  const { donation = 0, platformFee = 20 } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const uniqueCategories = [...new Set(cart.items.map(item => item.category))];
    const discount = uniqueCategories.length >= 2 ? subtotal * 0.1 : 0;
    const total = subtotal - discount + donation + platformFee;

    const newOrder = new Order({
      userId,
      items: cart.items,
      donation,
      platformFee,
      discount,
      total,
    });

    await newOrder.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeItem,
  updateCart,
  checkout
};
