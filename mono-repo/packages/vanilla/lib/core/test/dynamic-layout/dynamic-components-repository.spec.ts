import { DynamicComponentsRegistry } from '@frontend/vanilla/core';

class Cmp1 {}
class Cmp2 {}
class Cmp3 {}

describe('DynamicComponentsRegistry', () => {
    let service: DynamicComponentsRegistry;

    beforeEach(() => {
        service = new DynamicComponentsRegistry();
    });

    it('should store named components per category', () => {
        service.registerComponent('cat1', 'c1', Cmp1);
        service.registerComponent('cat1', 'c2', Cmp2);
        service.registerComponent('cat2', 'c1', Cmp3);

        expect(service.get('cat1', 'c1')).toBe(Cmp1);
        expect(service.get('cat1', 'c2')).toBe(Cmp2);
        expect(service.get('cat2', 'c1')).toBe(Cmp3);
        expect(service.get('cat3', 'c1')).toBeNull();
        expect(service.get('cat1', 'c3')).toBeNull();
    });
});
