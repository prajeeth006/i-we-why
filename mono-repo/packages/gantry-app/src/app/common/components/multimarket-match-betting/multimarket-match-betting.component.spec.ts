import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimarketMatchBettingComponent } from './multimarket-match-betting.component';

describe('MultimarketMatchBettingComponent', () => {
    let component: MultimarketMatchBettingComponent;
    let fixture: ComponentFixture<MultimarketMatchBettingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MultimarketMatchBettingComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultimarketMatchBettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
