import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeMatchHandicapComponent } from './dark-theme-match-handicap.component';

describe('DarkThemeMatchHandicapComponent', () => {
    let component: DarkThemeMatchHandicapComponent;
    let fixture: ComponentFixture<DarkThemeMatchHandicapComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeMatchHandicapComponent],
        });
        fixture = TestBed.createComponent(DarkThemeMatchHandicapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
