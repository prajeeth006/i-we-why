import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DsModalHeaderDrag } from './modal-header-drag.component';

describe('DsModalHeaderDrag', () => {
    let fixture: ComponentFixture<DsModalHeaderDrag>;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [DsModalHeaderDrag] });
        fixture = TestBed.createComponent(DsModalHeaderDrag);
    });

    it('should render drag rectangle', () => {
        const el = fixture.debugElement.query(By.css('.ds-modal-header-drag-rectangle'));
        expect(el).toBeTruthy();
    });
});
