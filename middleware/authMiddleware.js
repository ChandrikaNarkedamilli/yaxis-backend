const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');

dotEnv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.userId = user._id; // Attach user to request object
    next();
  } catch (error) {
  console.error(error);
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }
  res.status(401).json({ message: 'Invalid token' });
}
}

module.exports = authMiddleware;