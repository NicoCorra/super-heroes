module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: [
    '<rootDir>/src/setup.jest.ts'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/src/app/auth/',
    '<rootDir>/src/app/components/',
    '<rootDir>/src/app/directivas/',
    '<rootDir>/src/app/heroes/',
    '<rootDir>/src/app/interfaces/',
    '<rootDir>/src/app/material/',
    '<rootDir>/src/app/pipes/',
    '<rootDir>/src/app/shared/',
    '<rootDir>/src/app/app.component.spec.ts'
  ],
  transform: {
    '^.+\\.(ts|tsx|js|mjs)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
        diagnostics: false,
        useESM: true
      }
    ]
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  roots: [
    '<rootDir>/src'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|jest-preset-angular|ngrx|deck.gl|ng-dynamic))'
  ],
  extensionsToTreatAsEsm: [
    '.ts',
    '.tsx'
  ],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '.*\\e2e\\.spec\\.ts$',
    '.*\\.functional\\.spec\\.ts'
  ]
};
