// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { placeOrder, getOrdersByUser } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// router.get("/user/:userId", getOrdersByUser);
router.post("/checkout",authMiddleware, placeOrder);
module.exports = router;
