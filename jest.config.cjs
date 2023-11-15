/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: "./coverage",
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/{index,swagger}.ts"],
    coveragePathIgnorePatterns: ["/node_modules/"]
};
