const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Apikey, Apirequestlog } = require('../models');

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

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        id: { [require('sequelize').Op.ne]: req.user.id } // Exclude current admin user
      },
      attributes: ['id', 'username', 'email', 'role'],
      include: [{
        model: Apikey,
        as: 'Apikeys',
        attributes: ['key', 'isActive'],
        where: {
          isActive: true,
          [require('sequelize').Op.or]: [
            { expiresAt: null },
            { expiresAt: { [require('sequelize').Op.gt]: new Date() } }
          ]
        },
        required: false
      }]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username;
    user.email = email;
    user.role = role;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete associated API keys and logs first
    await Apikey.destroy({ where: { userId: id } });
    await Apirequestlog.destroy({ where: { userId: id } });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/api-keys', verifyToken, requireAdmin, async (req, res) => {
  try {
    const apiKeys = await Apikey.findAll({
      include: [{ model: User, as: 'User', attributes: ['username'] }]
    });
    res.json(apiKeys);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api-keys/:id/toggle', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = await Apikey.findByPk(id);
    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }
    apiKey.isActive = !apiKey.isActive;
    await apiKey.save();
    res.json({ message: 'API key status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/api-keys/:id/expiration', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresAt } = req.body;
    const apiKey = await Apikey.findByPk(id);
    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }
    apiKey.expiresAt = expiresAt ? new Date(expiresAt) : null;
    await apiKey.save();
    res.json({ message: 'API key expiration updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/api-keys/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = await Apikey.findByPk(id);
    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }
    await apiKey.destroy();
    res.json({ message: 'API key deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/logs', verifyToken, requireAdmin, async (req, res) => {
  try {
    const logs = await Apirequestlog.findAll({
      include: [{ model: User, as: 'User', attributes: ['username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/logs/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Apirequestlog.findByPk(id);
    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }
    await log.destroy();
    res.json({ message: 'Log deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;