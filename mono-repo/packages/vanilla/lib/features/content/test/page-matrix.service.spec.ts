import { DynamicComponentsRegistry } from '@frontend/vanilla/core';
import { PageMatrixService } from '@frontend/vanilla/features/content';

import { PCTextComponent } from '../src/components-v2/pc.components';

describe('PageMatrixService', () => {
    let service: PageMatrixService;

    beforeEach(() => {
        service = new PageMatrixService(new DynamicComponentsRegistry());
    });

    it('should store template to component mapping', () => {
        service.registerComponent('pctext', PCTextComponent);

        expect(service.getComponent('pctext')).toBe(PCTextComponent);
        expect(service.getComponent('pcwhatever')).toBeNull();
    });
});
