import { ToastrDynamicComponentsRegistry } from '@frontend/vanilla/core';

class Cmp1 {}
class Cmp2 {}
class Cmp3 {}

describe('ToastrDynamicComponentsRegistry', () => {
    let service: ToastrDynamicComponentsRegistry;

    beforeEach(() => {
        service = new ToastrDynamicComponentsRegistry();
    });

    it('should store named components', () => {
        service.registerComponent('c1', Cmp1);
        service.registerComponent('c2', Cmp2);
        service.registerComponent('c3', Cmp3);

        expect(service.get('c1')).toBe(Cmp1);
        expect(service.get('c2')).toBe(Cmp2);
        expect(service.get('c3')).toBe(Cmp3);
    });
});
