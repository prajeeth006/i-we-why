import { ElementRepositoryService } from '@frontend/vanilla/core';

import { HtmlElementMock } from '../../../core/test/element-ref.mock';

describe('DeviceService', () => {
    let service: ElementRepositoryService;

    beforeEach(() => {
        service = new ElementRepositoryService();
    });

    describe('get()', () => {
        it('should get registered item', () => {
            const element: any = new HtmlElementMock();

            service.register('key', element);

            expect(service.get('key')).toBe(element);
        });
    });

    describe('remove()', () => {
        it('should remove registered item', () => {
            const element: any = new HtmlElementMock();

            service.register('key', element);
            service.remove('key');

            expect(service.get('key')).toBeNull();
        });
    });

    describe('register()', () => {
        it('should throw when registering item with the same key', () => {
            const element: any = new HtmlElementMock();

            service.register('key', element);
            expect(() => service.register('key', element)).toThrowError();
        });
    });
});
