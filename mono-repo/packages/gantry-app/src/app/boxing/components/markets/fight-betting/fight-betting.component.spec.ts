import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FightBettingComponent } from './fight-betting.component';

describe('FightBettingComponent', () => {
    let component: FightBettingComponent;
    let fixture: ComponentFixture<FightBettingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FightBettingComponent],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FightBettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
