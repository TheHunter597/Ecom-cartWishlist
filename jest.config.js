module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  moduleFileExtensions: ["ts", "tsx", "js", "json", "node"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  setupFilesAfterEnv: [
    "<rootDir>/src/utils/tests/testSetup.ts",
    "<rootDir>/src/utils/tests/redisClientMock.ts",
  ],
};
