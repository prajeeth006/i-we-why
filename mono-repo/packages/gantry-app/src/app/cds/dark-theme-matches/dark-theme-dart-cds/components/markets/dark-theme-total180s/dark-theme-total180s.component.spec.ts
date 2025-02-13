import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeTotal180sComponent } from './dark-theme-total180s.component';

describe('DarkThemeTotal180sComponent', () => {
    let component: DarkThemeTotal180sComponent;
    let fixture: ComponentFixture<DarkThemeTotal180sComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeTotal180sComponent],
        });
        fixture = TestBed.createComponent(DarkThemeTotal180sComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
