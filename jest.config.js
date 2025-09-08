/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  restoreMocks: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/tests/**'],
  // Increase default timeout to accommodate MongoDB binary download/startup on CI/Windows
  testTimeout: 90000,
};
