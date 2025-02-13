import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeMatchHanicapComponent } from './dark-theme-match-hanicap.component';

describe('DarkThemeMatchHanicapComponent', () => {
    let component: DarkThemeMatchHanicapComponent;
    let fixture: ComponentFixture<DarkThemeMatchHanicapComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeMatchHanicapComponent],
        });
        fixture = TestBed.createComponent(DarkThemeMatchHanicapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
