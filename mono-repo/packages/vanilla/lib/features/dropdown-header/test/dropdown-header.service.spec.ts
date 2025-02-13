import { TestBed } from '@angular/core/testing';

import { DropDownHeaderService } from '../src/dropdown-header.service';

class SampleComponent {}

describe('DropDownHeaderService', () => {
    let service: DropDownHeaderService;
    let isOpen: boolean;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DropDownHeaderService],
        });

        service = TestBed.inject(DropDownHeaderService);
        service.dropDownMenuToggle.subscribe((v) => (isOpen = v));
    });
    describe('toggle', () => {
        it('should be closed by default', () => {
            expect(isOpen).toBeFalse();
        });

        it('should toggle when method called', () => {
            service.toggleMenu(true);
            expect(isOpen).toBeTrue();

            service.toggleMenu(false);
            expect(isOpen).toBeFalse();
        });
    });

    describe('menu item templates', () => {
        it('should allow to set menu item templates', () => {
            service.setDropDownHeaderComponent('type', SampleComponent);

            expect(service.getDropDownHeaderComponent('type')).toBe(SampleComponent);
        });

        it('should allow to set default item template', () => {
            service.setDropDownHeaderComponent('button', SampleComponent);

            expect(service.getDropDownHeaderComponent(undefined)).toBe(SampleComponent);
        });
    });
});
