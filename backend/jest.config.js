// Jest configuration for backend tests
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterSetup: [],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['controllers/**/*.js', 'models/**/*.js', 'routes/**/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  testTimeout: 10000,
};
