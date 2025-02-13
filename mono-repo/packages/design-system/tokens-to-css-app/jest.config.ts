/* eslint-disable */
export default {
    displayName: 'design-system-tokens-to-css-app',
    preset: '../../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../dist/test/packages/design-system/tokens-to-css-app/coverage',
};
