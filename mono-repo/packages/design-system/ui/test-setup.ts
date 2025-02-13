import 'jest-preset-angular/setup-jest';

// mock scrollIntoView as it's not mocked in jsdom
Element.prototype.scrollIntoView = jest.fn();

// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
    testEnvironmentOptions: {
        errorOnUnknownElements: true,
        errorOnUnknownProperties: true,
    },
};
