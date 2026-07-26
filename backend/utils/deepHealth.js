// Health check with DB connectivity test
const mongoose = require('mongoose');
const os = require('os');

const deepHealth = async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const health = {
    status: mongoStatus === 'connected' ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: os.cpus().length,
    load: os.loadavg(),
    mongo: { status: mongoStatus, db: mongoose.connection.name || 'N/A' },
    env: process.env.NODE_ENV || 'development',
  };
  const statusCode = mongoStatus === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
};

module.exports = deepHealth;
