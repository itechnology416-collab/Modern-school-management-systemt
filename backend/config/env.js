// Environment-specific config
const env = process.env.NODE_ENV || 'development';

const configs = {
  development: { logLevel: 'debug', corsOrigins: ['http://localhost:5173'], rateLimitMax: 200, enableSwagger: true },
  staging: { logLevel: 'info', corsOrigins: [process.env.CLIENT_URL, process.env.STAGING_URL].filter(Boolean), rateLimitMax: 150, enableSwagger: true },
  production: { logLevel: 'warn', corsOrigins: [process.env.CLIENT_URL].filter(Boolean), rateLimitMax: 100, enableSwagger: false },
};

const current = configs[env] || configs.development;

module.exports = {
  ...current,
  env,
  isDev: env === 'development',
  isProduction: env === 'production',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
