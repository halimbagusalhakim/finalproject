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

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const apiKey = await Apikey.findOne({ where: { userId, isActive: true } });
    if (!apiKey) {
      return res.json({ key: null, isActive: false });
    }
    res.json({ key: apiKey.key, isActive: apiKey.isActive, expiresAt: apiKey.expiresAt });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/generate', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has an active API key
    const existingKey = await Apikey.findOne({ where: { userId, isActive: true } });
    if (existingKey) {
      return res.json({ key: existingKey.key });
    }

    // Deactivate any existing inactive keys
    await Apikey.update({ isActive: false }, { where: { userId, isActive: false } });

    // Generate new API key with 1 month expiration
    const key = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1); // Add 1 month
    const newKey = await Apikey.create({ key, userId, isActive: true, expiresAt });

    res.json({ key: newKey.key });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;