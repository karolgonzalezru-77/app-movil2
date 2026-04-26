module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "App.js",
    "src/services/**/*.js",
    "screens/**/*.js",
    "hooks/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "constants/**/*.{ts,tsx}",
    "!**/*.d.ts",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
};
