const jwt = require('jsonwebtoken');
const { findById } = require('../models/userModel');

module.exports = function auth(req, res, next) {
  try {
    const header = req.headers['authorization'] || '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
