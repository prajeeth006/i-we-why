import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimarketHomeSelectionAwayComponent } from './multimarket-home-selection-away.component';

describe('MultimarketHomeSelectionAwayComponent', () => {
    let component: MultimarketHomeSelectionAwayComponent;
    let fixture: ComponentFixture<MultimarketHomeSelectionAwayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultimarketHomeSelectionAwayComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultimarketHomeSelectionAwayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
