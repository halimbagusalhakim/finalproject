const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const https = require('https');
const fs = require('fs');
const db = require('./models');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// API keys routes
const apiKeyRoutes = require('./routes/api-keys');
app.use('/api-keys', apiKeyRoutes);

// Public API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Admin routes
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to MotoGP API' });
});

// Sync database
db.sequelize.sync().then(() => {
  console.log('Database synced');
}).catch((err) => {
  console.error('Error syncing database:', err);
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server running on port ${PORT} with HTTPS`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with HTTP`);
  });
}

module.exports = app;