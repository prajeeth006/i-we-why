import { LocalStoreService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

const values = new Map<string, any>();

export const LocalStoreServiceMock = MockService(LocalStoreService, {
    set: jest.fn((key: string, value: any) => {
        values.set(key, value);
    }),
    get: jest.fn((key: string) => values.get(key)),
    remove: jest.fn((key: string) => values.delete(key)),
    keys: jest.fn(),
});
