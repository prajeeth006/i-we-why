import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeMatchBettingComponent } from './dark-theme-match-betting.component';

describe('DarkThemeMatchBettingComponent', () => {
    let component: DarkThemeMatchBettingComponent;
    let fixture: ComponentFixture<DarkThemeMatchBettingComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeMatchBettingComponent],
        });
        fixture = TestBed.createComponent(DarkThemeMatchBettingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
