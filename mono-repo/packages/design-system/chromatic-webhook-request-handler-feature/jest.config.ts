/* eslint-disable */
export default {
    displayName: 'design-system-chromatic-webhook-request-handler-feature',
    preset: '../../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../dist/test/packages/design-system/chromatic-webhook-request-handler-feature/coverage',
};
