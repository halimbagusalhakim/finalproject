const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Apikey } = require('../models');

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access token required' });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/generate', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has an API key
    const existingKey = await Apikey.findOne({ where: { userId } });
    if (existingKey) {
      return res.json({ key: existingKey.key });
    }

    // Generate new API key
    const key = crypto.randomUUID();
    const newKey = await Apikey.create({ key, userId });

    res.json({ key: newKey.key });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;