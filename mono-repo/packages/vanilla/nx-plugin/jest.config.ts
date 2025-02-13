/* eslint-disable */
export default {
    displayName: 'vanilla-nx-plugin',
    preset: '../../../jest.preset.js',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../dist/test/packages/vanilla/nx-plugin/coverage',
};
