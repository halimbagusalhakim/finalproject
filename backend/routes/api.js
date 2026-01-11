const express = require('express');
const { Rider, Team, Apikey, Apirequestlog } = require('../models');

const router = express.Router();

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to verify API key
const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ message: 'API key required' });
  }

  try {
    const keyRecord = await Apikey.findOne({
      where: { key: apiKey },
      include: [{ model: require('../models').User, as: 'User' }]
    });
    if (!keyRecord || !keyRecord.isActive) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    // Check if API key has expired
    if (keyRecord.expiresAt && new Date() > new Date(keyRecord.expiresAt)) {
      return res.status(401).json({ message: 'API key has expired' });
    }

    // Log the request
    await Apirequestlog.create({
      userId: keyRecord.userId,
      endpoint: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    req.userId = keyRecord.userId;
    req.userRole = keyRecord.User.role;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

router.get('/data', verifyApiKey, async (req, res) => {
  try {
    const [rawRiders, teams] = await Promise.all([
      Rider.findAll({
        include: [{ model: Team, as: 'Team', attributes: ['name'] }]
      }),
      Team.findAll({
        attributes: ['name', 'country']
      })
    ]);

    const riders = rawRiders.map(rider => ({
      name: rider.name,
      nationality: rider.nationality,
      birthdate: rider.birthdate,
      team: rider.Team ? rider.Team.name : null
    }));

    res.json({ riders, teams });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;