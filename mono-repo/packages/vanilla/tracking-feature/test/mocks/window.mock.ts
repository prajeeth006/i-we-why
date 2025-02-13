import { CustomWindow } from '@frontend/vanilla/core';

export const WindowMock = {
    document: {
        referrer: 'http://bwin.com',
        createElement: () => ({
            addEventListener: jest.fn(),
        }),
        body: {
            appendChild: jest.fn(),
            append: jest.fn(),
        },
        querySelector: jest.fn(),
    } as unknown as Document,
    location: {
        href: 'page1',
    },
    dataLayer: [],
    decibelInsight: jest.fn((method: string, handler: () => void) => {
        if (method === 'ready') handler();
        if (method === 'getSessionId') return 'di-81649-BAA44AC48A01AE892D22AA13555869752A';

        return '';
    }),
} as unknown as CustomWindow;
