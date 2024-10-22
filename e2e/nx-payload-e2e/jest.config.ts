 
export default {
  displayName: 'nx-payload-e2e',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json'
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-payload-e2e',
  globalSetup: '../utils/start-local-registry.ts',
  globalTeardown: '../utils/stop-local-registry.ts'
};
