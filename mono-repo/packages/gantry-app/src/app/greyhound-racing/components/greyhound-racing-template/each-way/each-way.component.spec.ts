import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreyhoundEachWayComponent } from './each-way.component';

describe('GreyhoundEachWayComponent', () => {
    let component: GreyhoundEachWayComponent;
    let fixture: ComponentFixture<GreyhoundEachWayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GreyhoundEachWayComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GreyhoundEachWayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
