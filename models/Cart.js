const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  quantity: { type: Number, default: 1 },
  description: String, // optional
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [cartItemSchema],
  discount: { type: Number, default: 0 }, // optional
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
