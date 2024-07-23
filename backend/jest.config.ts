import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  setupFiles: ['./src/tests/environments.js'],
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.{entity,repository,dto,model}.ts',
    '!src/environments/*.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!**/node_modules/**',
  ],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coverageDirectory: 'coverage',
  testTimeout: 30000,
};

export default config;
