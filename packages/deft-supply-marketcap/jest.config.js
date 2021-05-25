module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/lib/"],
  globals: {
    __DEV__: true,
    "ts-jest": {
      diagnostics: false,
      // diagnostics: {
      //   ignoreCodes: [6133],
      // },
    },
  },
};
