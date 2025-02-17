/** @type {import('jest').Config} */
const config = {
  moduleDirectories: ['node_modules', 'src'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFiles: ['./jest.setup.js'],
  collectCoverage: true, // Enables coverage collection
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}', // Collect coverage from your source files
    '!src/**/*.test.{js,jsx,ts,tsx}', // Exclude test files from coverage
    '!src/**/*.d.ts', // Exclude type declaration files if you're using TypeScript
  ],
  coverageDirectory: 'coverage', // Directory to output the coverage reports
  coverageReporters: ['text', 'lcov', 'html'], // Report formats (text, lcov, html)
};

module.exports = config;
