const logger = require('./logger');

const gracefulShutdown = (server) => {
  const shutdown = async (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    // Force close after 10 seconds
    setTimeout(() => { logger.error('Forced shutdown after timeout'); process.exit(1); }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => { logger.error('Unhandled Rejection:', reason); });
  process.on('uncaughtException', (err) => { logger.error('Uncaught Exception:', err); process.exit(1); });
};

module.exports = gracefulShutdown;
