/* eslint-disable */
export default {
    displayName: 'usage-reports-utils',
    preset: '../../../jest.preset.js',
    setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
    coverageDirectory: '../../../dist/test/packages/design-system/usage-reports-utils/coverage',
    transform: {
        '^.+\\.(ts|mjs|js|html)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
            },
        ],
        '^.+\\.[tj]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
    snapshotSerializers: [
        'jest-preset-angular/build/serializers/no-ng-attributes',
        'jest-preset-angular/build/serializers/ng-snapshot',
        'jest-preset-angular/build/serializers/html-comment',
    ],
};
