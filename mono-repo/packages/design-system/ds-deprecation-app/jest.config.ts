/* eslint-disable */
export default {
    displayName: 'ds-deprecation-app',
    preset: '../../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../dist/test/packages/design-system/ds-deprecation-app/coverage',
};
