const User = require('../models/User');
const Order = require("../models/Order");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const secretKey = process.env.JWT_SECRET


const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword ,isNewUser: true });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Registration failed', error: err.message });
  }
};

const userLogin = async (req, res) => {
  const {email,password} = req.body
  try {
    const user = await User.findOne({ email });
    if (!user|| !(await bcrypt.compare(password, user.password))){
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id ,name: user.username, email : user.email}, secretKey, {expiresIn: '1h'});
    const isNewUser = user.isNewUser;
    if (isNewUser) {
      user.isNewUser = false;
      await user.save();
    }
    const userId = user._id;
    res.status(200).json({success : "Login Successful!", token, userId});
    console.log(email, " this is the token",token)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Login failed'});
  }
};

const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password"); // Exclude password
    const orders = await Order.find({ user: decoded.userId });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user, orders });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};

module.exports = {userRegister,userLogin, getUserProfile};
